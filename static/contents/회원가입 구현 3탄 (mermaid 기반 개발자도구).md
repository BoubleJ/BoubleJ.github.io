---
date: "2026-03-01"
title: "회원가입 구현 3탄 (mermaid 기반 개발자도구) (작성중)"
categories: ["React"]
summary: "공통 input 컴포넌트를 만들어보자."
thumbnail: "/thumbnail/머메이드.png"
---


```tsx
'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { cn } from '@/src/common/utils/twMerge'

interface AuthStepDiagramDevtoolProps<TStep extends number = number> {
  currentStep: TStep
  totalSteps: number
  onJumpStep: (step: TStep) => void
  title?: string
}

const MERMAID_CALLBACK_NAME = 'authStepMermaidCallback'
let isMermaidInitialized = false

const sanitizeId = (value: string) => value.replace(/[^a-zA-Z0-9_]/g, '_')

const parseStepFromNodeId = (nodeId: string): number | undefined => {
  const match = nodeId.match(/^step_(\d+)$/)
  return match ? Number(match[1]) : undefined
}

const buildGraphDefinition = (totalSteps: number, currentStep: number): string => {
  const lines: string[] = ['graph TD']

  for (let i = 1; i <= totalSteps; i++) {
    lines.push(`step_${i}["step${i}"]`)
  }

  for (let i = 1; i < totalSteps; i++) {
    lines.push(`step_${i} --> step_${i + 1}`)
  }

  if (currentStep >= 1 && currentStep <= totalSteps) {
    lines.push(`style step_${currentStep} fill:#ff5f66,stroke:#ff3344,stroke-width:2px,color:#ffffff,font-weight:bold`)
  }

  for (let i = 1; i <= totalSteps; i++) {
    lines.push(`click step_${i} ${MERMAID_CALLBACK_NAME}`)
  }

  return lines.join('\n')
}

function useMermaidGraph(isOpen: boolean, graphDefinition: string, onNodeClick: (nodeId: string) => void) {
  const graphRef = useRef<HTMLDivElement | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const componentId = sanitizeId(useId())

  useEffect(() => {
    if (!isOpen) return

    const win = window as Window & { [MERMAID_CALLBACK_NAME]?: (nodeId: string) => void }
    win[MERMAID_CALLBACK_NAME] = onNodeClick

    return () => {
      if (win[MERMAID_CALLBACK_NAME] === onNodeClick) {
        delete win[MERMAID_CALLBACK_NAME]
      }
    }
  }, [isOpen, onNodeClick])

  useEffect(() => {
    if (!isOpen || !graphRef.current) return

    let isCancelled = false

    const renderGraph = async () => {
      try {
        setErrorMessage(null)
        const mermaid = (await import('mermaid')).default

        if (!isMermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'loose',
            theme: 'dark',
            flowchart: { useMaxWidth: true },
            themeVariables: {
              fontFamily: 'Pretendard, sans-serif',
              primaryTextColor: '#e5e7eb',
              lineColor: '#94a3b8',
              edgeLabelBackground: '#334155',
            },
          })
          isMermaidInitialized = true
        }

        const renderId = `auth_step_graph_${componentId}_${Date.now()}`
        const { svg, bindFunctions } = await mermaid.render(renderId, graphDefinition)
        if (isCancelled || !graphRef.current) return

        graphRef.current.innerHTML = svg
        bindFunctions?.(graphRef.current)
      } catch (error) {
        if (isCancelled) return
        setErrorMessage(error instanceof Error ? error.message : '그래프를 렌더링하지 못했습니다.')
      }
    }

    renderGraph()

    return () => {
      isCancelled = true
    }
  }, [componentId, graphDefinition, isOpen])

  return { graphRef, errorMessage }
}

export default function AuthStepDiagramDevtool<TStep extends number = number>({
  currentStep,
  totalSteps,
  onJumpStep,
  title = 'Auth Step Diagram',
}: AuthStepDiagramDevtoolProps<TStep>) {
  const [isOpen, setIsOpen] = useState(false)

  const graphDefinition = useMemo(() => buildGraphDefinition(totalSteps, currentStep), [totalSteps, currentStep])

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      const step = parseStepFromNodeId(nodeId)
      if (step !== undefined) onJumpStep(step as TStep)
    },
    [onJumpStep],
  )

  const { graphRef, errorMessage } = useMermaidGraph(isOpen, graphDefinition, handleNodeClick)

  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="fixed bottom-5 left-5 z-[120]">
      {isOpen && (
        <section className="absolute bottom-[60px] left-0 w-[min(92vw,200px)] rounded-xl border border-[#2c3d56] bg-[#101b2d] p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold text-[#d1d5db]">{title}</p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-2 py-1 text-[11px] text-[#cbd5e1] hover:bg-[#1e293b]"
            >
              닫기
            </button>
          </div>
          <p className="mb-3 text-[11px] text-[#93c5fd]">{`현재 스텝: ${String(currentStep)}`}</p>

          {errorMessage ? (
            <p className="rounded-md bg-[#0b1220] p-3 text-xs text-[#fca5a5]">{errorMessage}</p>
          ) : (
            <div
              ref={graphRef}
              className={cn(
                'flex max-h-[320px] justify-center overflow-auto rounded-md bg-[#0b1220] p-2',
                '[&_svg]:h-auto [&_svg]:w-full',
                '[&_svg_text]:fill-[#e5e7eb]',
              )}
            />
          )}
        </section>
      )}

      <button
        type="button"
        aria-label="Open auth step diagram devtool"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-[#111827] shadow-lg transition-colors',
          isOpen ? 'bg-[#f59e0b]' : 'bg-[#facc15]',
        )}
      >
        DEV
      </button>
    </div>
  )
}

```


```tsx

  const methods = useForm<JoinEmailFormData>({
    resolver: zodResolver(joinEmailFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      verification: '',
      password: '',
      confirmPassword: '',
      isMarketingAgree: false,
      signupCode: '',
    },
  })
  const [step, setStep] = useState<JoinEmailStep>(1)


   <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {step === 1 && <JoinEmailStep1 onNextStep={handleNextStep} />}
          {step === 2 && <JoinEmailStep2 onNextStep={handleNextStep} />}
          {step === 3 && <JoinEmailStep3 onNextStep={handleNextStep} />}
          {step === 4 && <JoinEmailStep4 />}
        </form>
      </FormProvider>
      <AuthStepDiagramDevtool title="회원가입" currentStep={step} totalSteps={4} onJumpStep={handleNextStep} />
```

<details>

<summary>참고문헌</summary>

<div markdown="1">

https://velog.io/@juhyeon1114/AWS-S3%EC%99%80-Cloudfront%EB%A1%9C-%EC%9B%B9%EC%82%AC%EC%9D%B4%ED%8A%B8-%EB%B0%B0%ED%8F%AC

</div>

</details>
