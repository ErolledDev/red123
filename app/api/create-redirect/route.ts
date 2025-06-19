import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface FormData {
  title: string
  desc: string
  url: string
  image: string
  keywords: string
  site_name: string
  type: string
  slug: string
}

interface RedirectData {
  title: string
  desc: string
  url: string
  image: string
  keywords: string
  site_name: string
  type: string
  created_at: string
  updated_at: string
}

interface RedirectsData {
  [slug: string]: RedirectData
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== CREATE REDIRECT API START ===')
    
    const data: FormData = await request.json()
    console.log('Received data:', JSON.stringify(data, null, 2))
    
    // Validate required fields
    if (!data.title || !data.desc || !data.url) {
      console.error('Validation failed: Missing required fields')
      return NextResponse.json(
        { error: 'Title, description, and URL are required' },
        { status: 400 }
      )
    }
    
    // Generate slug if not provided
    let slug = data.slug
    if (!slug) {
      slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .substring(0, 100)
    }
    
    // Ensure slug is valid
    if (!slug) {
      slug = 'redirect-' + Date.now()
    }
    
    console.log('Generated slug:', slug)
    
    // Try multiple file path strategies for AWS Amplify
    const possiblePaths = [
      path.join(process.cwd(), 'redirects.json'),
      path.join('/tmp', 'redirects.json'),
      './redirects.json',
      'redirects.json'
    ]
    
    let filePath = ''
    let redirects: RedirectsData = {}
    let fileExists = false
    
    // Try to find and read existing file
    for (const testPath of possiblePaths) {
      try {
        console.log(`Trying to read from: ${testPath}`)
        await fs.access(testPath)
        const fileContents = await fs.readFile(testPath, 'utf8')
        redirects = JSON.parse(fileContents) as RedirectsData
        filePath = testPath
        fileExists = true
        console.log(`Successfully read from: ${testPath}`)
        break
      } catch (error) {
        console.log(`Failed to read from ${testPath}:`, error instanceof Error ? error.message : 'Unknown error')
        continue
      }
    }
    
    // If no existing file found, try to create in writable location
    if (!fileExists) {
      console.log('No existing file found, trying to create new one')
      
      // Try /tmp first (most likely to work in serverless)
      const tmpPath = path.join('/tmp', 'redirects.json')
      try {
        await fs.writeFile(tmpPath, '{}', 'utf8')
        filePath = tmpPath
        console.log(`Created new file at: ${tmpPath}`)
      } catch (tmpError) {
        console.log('Failed to create in /tmp:', tmpError instanceof Error ? tmpError.message : 'Unknown error')
        
        // Fallback to current directory
        const cwdPath = path.join(process.cwd(), 'redirects.json')
        try {
          await fs.writeFile(cwdPath, '{}', 'utf8')
          filePath = cwdPath
          console.log(`Created new file at: ${cwdPath}`)
        } catch (cwdError) {
          console.error('Failed to create file in any location:', cwdError)
          
          // If we can't write files, return the data anyway for client-side handling
          const currentTime = new Date().toISOString()
          const redirectData: RedirectData = {
            title: data.title.trim(),
            desc: data.desc.trim(),
            url: data.url.trim(),
            image: data.image ? data.image.trim() : '',
            keywords: data.keywords ? data.keywords.trim() : '',
            site_name: data.site_name ? data.site_name.trim() : '',
            type: data.type || 'website',
            created_at: currentTime,
            updated_at: currentTime
          }
          
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
          const params = new URLSearchParams({
            title: redirectData.title,
            desc: redirectData.desc,
            url: redirectData.url,
            ...(redirectData.image && { image: redirectData.image }),
            ...(redirectData.keywords && { keywords: redirectData.keywords }),
            ...(redirectData.site_name && { site_name: redirectData.site_name }),
            type: redirectData.type
          })
          
          const longUrl = `${baseUrl}/u?${params.toString()}`
          const shortUrl = `${baseUrl}/${slug}`
          
          console.log('Returning URLs without file persistence due to file system restrictions')
          
          return NextResponse.json({
            long: longUrl,
            short: shortUrl,
            slug: slug,
            success: true,
            warning: 'Data not persisted due to file system restrictions in serverless environment',
            data: redirectData
          })
        }
      }
    }
    
    // Check if slug already exists (for new redirects, not updates)
    const isUpdate = data.slug && redirects[slug]
    if (!isUpdate && redirects[slug]) {
      slug = `${slug}-${Date.now()}`
      console.log('Slug collision, using:', slug)
    }
    
    // Create redirect data object with timestamps
    const currentTime = new Date().toISOString()
    const redirectData: RedirectData = {
      title: data.title.trim(),
      desc: data.desc.trim(),
      url: data.url.trim(),
      image: data.image ? data.image.trim() : '',
      keywords: data.keywords ? data.keywords.trim() : '',
      site_name: data.site_name ? data.site_name.trim() : '',
      type: data.type || 'website',
      created_at: isUpdate ? (redirects[slug]?.created_at || currentTime) : currentTime,
      updated_at: currentTime
    }
    
    // Add or update redirect
    redirects[slug] = redirectData
    console.log('Updated redirects object, total entries:', Object.keys(redirects).length)
    
    // Try to write back to file
    try {
      await fs.writeFile(filePath, JSON.stringify(redirects, null, 2), 'utf8')
      console.log(`Successfully wrote to: ${filePath}`)
    } catch (writeError) {
      console.error('Failed to write file:', writeError)
      
      // Even if write fails, return the URLs
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const params = new URLSearchParams({
        title: redirectData.title,
        desc: redirectData.desc,
        url: redirectData.url,
        ...(redirectData.image && { image: redirectData.image }),
        ...(redirectData.keywords && { keywords: redirectData.keywords }),
        ...(redirectData.site_name && { site_name: redirectData.site_name }),
        type: redirectData.type
      })
      
      const longUrl = `${baseUrl}/u?${params.toString()}`
      const shortUrl = `${baseUrl}/${slug}`
      
      return NextResponse.json({
        long: longUrl,
        short: shortUrl,
        slug: slug,
        success: true,
        warning: 'Redirect created but not persisted due to file system restrictions',
        data: redirectData
      })
    }
    
    // Generate URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const params = new URLSearchParams({
      title: redirectData.title,
      desc: redirectData.desc,
      url: redirectData.url,
      ...(redirectData.image && { image: redirectData.image }),
      ...(redirectData.keywords && { keywords: redirectData.keywords }),
      ...(redirectData.site_name && { site_name: redirectData.site_name }),
      type: redirectData.type
    })
    
    const longUrl = `${baseUrl}/u?${params.toString()}`
    const shortUrl = `${baseUrl}/${slug}`
    
    console.log(`Successfully ${isUpdate ? 'updated' : 'created'} redirect: ${slug}`)
    console.log('=== CREATE REDIRECT API END ===')
    
    return NextResponse.json({
      long: longUrl,
      short: shortUrl,
      slug: slug,
      success: true,
      isUpdate: isUpdate
    })
    
  } catch (error) {
    console.error('=== CREATE REDIRECT API ERROR ===')
    console.error('Error details:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    // Provide more specific error messages
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON data provided', details: error.message },
        { status: 400 }
      )
    }
    
    if (error instanceof Error && error.message.includes('ENOENT')) {
      return NextResponse.json(
        { error: 'File system access denied. Serverless environment restrictions.', details: error.message },
        { status: 500 }
      )
    }
    
    if (error instanceof Error && error.message.includes('EACCES')) {
      return NextResponse.json(
        { error: 'Permission denied. File system not writable in serverless environment.', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create redirect. Please try again.', 
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : 'Unknown'
      },
      { status: 500 }
    )
  }
}