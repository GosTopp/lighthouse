import { useEffect, useRef } from "react"

interface KeyboardHandlers {
  onSpace?: () => void
  onEnter?: () => void
  onEscape?: () => void
}

export function useKeyboardHandlers(handlers: KeyboardHandlers) {
  const ref = useRef<HTMLElement>(null)
  const handlerRef = useRef(handlers)

  // 更新处理程序引用
  useEffect(() => {
    handlerRef.current = handlers
  }, [handlers])

  // 键盘事件处理
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && handlerRef.current.onSpace) {
        e.preventDefault()
        handlerRef.current.onSpace()
      } else if (e.code === "Enter" && handlerRef.current.onEnter) {
        e.preventDefault()
        handlerRef.current.onEnter()
      } else if (e.code === "Escape" && handlerRef.current.onEscape) {
        e.preventDefault()
        handlerRef.current.onEscape()
      }
    }

    element.addEventListener("keydown", handleKeyDown)
    return () => {
      element.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return ref
} 