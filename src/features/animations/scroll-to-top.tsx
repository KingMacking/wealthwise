import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowUp } from 'lucide-react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return

    const onScroll = () => setVisible(main.scrollTop > 400)
    main.addEventListener('scroll', onScroll, { passive: true })
    return () => main.removeEventListener('scroll', onScroll)
  }, [])

  const scrollUp = () => {
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          onClick={scrollUp}
          aria-label="Volver arriba"
          className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
