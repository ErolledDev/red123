import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface RedirectData {
  title: string
  desc: string
  url: string
  image: string
  keywords: string
  site_name: string
  type: string
}

interface RedirectsData {
  [slug: string]: RedirectData
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('=== DELETE REDIRECT API START ===')
    
    // Get slug from URL query parameters
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      console.error('Invalid or missing slug in query parameters')
      return NextResponse.json(
        { error: 'Valid slug is required as query parameter' },
        { status: 400 }
      )
    }
    
    const trimmedSlug = slug.trim()
    console.log('Processing delete for slug:', trimmedSlug)
    
    // Try multiple file path strategies for AWS Amplify
    const possiblePaths = [
      path.join(process.cwd(), 'redirects.json'),
      path.join('/tmp', 'redirects.json'),
      './redirects.json',
      'redirects.json'
    ]
    
    let filePath = ''
    let redirects: RedirectsData = {}
    let fileFound = false
    
    // Try to find and read existing file
    for (const testPath of possiblePaths) {
      try {
        console.log(`Trying to read from: ${testPath}`)
        await fs.access(testPath)
        const fileContents = await fs.readFile(testPath, 'utf8')
        redirects = JSON.parse(fileContents) as RedirectsData
        filePath = testPath
        fileFound = true
        console.log(`Successfully read from: ${testPath}`)
        break
      } catch (error) {
        console.log(`Failed to read from ${testPath}:`, error instanceof Error ? error.message : 'Unknown error')
        continue
      }
    }
    
    if (!fileFound) {
      console.error('Redirects file not found in any location')
      return NextResponse.json(
        { error: 'Redirects file not found' },
        { status: 404 }
      )
    }
    
    console.log('Current redirects keys:', Object.keys(redirects))
    
    // Check if redirect exists
    if (!redirects[trimmedSlug]) {
      console.error(`Redirect "${trimmedSlug}" not found in:`, Object.keys(redirects))
      return NextResponse.json(
        { error: `Redirect "${trimmedSlug}" not found` },
        { status: 404 }
      )
    }
    
    // Store the deleted item for logging
    const deletedItem = redirects[trimmedSlug]
    
    // Delete the redirect
    delete redirects[trimmedSlug]
    
    try {
      // Write the updated data back to the file
      await fs.writeFile(filePath, JSON.stringify(redirects, null, 2), 'utf8')
      
      console.log(`Successfully deleted redirect: ${trimmedSlug}`, deletedItem)
      console.log('=== DELETE REDIRECT API END ===')
      
      return NextResponse.json({ 
        success: true, 
        message: `Redirect "${trimmedSlug}" deleted successfully`,
        deletedSlug: trimmedSlug
      })
      
    } catch (writeError) {
      console.error('Error writing to file:', writeError)
      
      // Try to restore the deleted item if write failed
      redirects[trimmedSlug] = deletedItem
      
      return NextResponse.json(
        { 
          error: 'Failed to save changes. File system may be read-only in serverless environment.', 
          details: writeError instanceof Error ? writeError.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('=== DELETE REDIRECT API ERROR ===')
    console.error('Unexpected error deleting redirect:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error. Please try again later.', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}