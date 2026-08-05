import { NextResponse } from 'next/server'
import { CreateWindowRequestSchema } from '@repo/protocol/src/api'
import { prisma } from '@repo/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = CreateWindowRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    //assume a single workspace for now. Create if not exists.
    let workspace = await prisma.workspace.findFirst()
    if (!workspace) {
      const user = await prisma.user.create({
        data: { email: 'dev@example.com', name: 'Dev User' },
      })
      workspace = await prisma.workspace.create({
        data: { name: 'Default Workspace', userId: user.id },
      })
    }

    // Create Application
    const application = await prisma.application.create({
      data: {
        type: 'CHROMIUM',
        name: 'Chromium',
      },
    })

    // Create Instance
    const instanceId = Math.random().toString(16).substring(2, 8)
    const instance = await prisma.applicationInstance.create({
      data: {
        shortId: instanceId,
        applicationId: application.id,
        workspaceId: workspace.id,
        status: 'PENDING',
      },
    })

    // Create Deployment
    await prisma.deployment.create({
      data: {
        instanceId: instance.id,
        phase: 'CREATING_RESOURCES',
      },
    })

    // Create Window
    const window = await prisma.window.create({
      data: {
        workspaceId: workspace.id,
        applicationId: application.id,
        instanceId: instance.id,
        title: 'Chromium',
      },
    })

    // Push job to Redis queue for the worker
    const { redis } = await import('@repo/redis')
    await redis.lpush(
      'deployment_jobs',
      JSON.stringify({
        type: 'deploy',
        instanceId: instance.shortId,
        application: 'chromium',
        workspaceId: workspace.id,
      })
    )

    return NextResponse.json({
      window_id: window.id,
      app_id: application.id,
      instance_id: instance.shortId,
      deployed_url: '',
      is_new_deploy: true,
      status: 'deploying',
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const windows = await prisma.window.findMany({
    include: {
      application: true,
      workspace: true,
    },
  })

  // Map to frontend expected shape
  const result = await Promise.all(
    windows.map(async w => {
      // For MVP, look up instance if exists
      let status = 'ready'
      let shortId = ''
      let deployedUrl = ''

      if (w.instanceId) {
        const instance = await prisma.applicationInstance.findUnique({
          where: { id: w.instanceId },
        })
        if (instance) {
          status =
            instance.status === 'READY'
              ? 'ready'
              : instance.status === 'FAILED'
                ? 'failed'
                : 'deploying'
          deployedUrl = instance.deployedUrl || ''
          shortId = instance.shortId
        }
      }

      return {
        window_id: w.id,
        app_id: w.applicationId,
        instance_id: shortId || w.instanceId,
        status,
        deployed_url: deployedUrl,
      }
    })
  )

  return NextResponse.json(result)
}
