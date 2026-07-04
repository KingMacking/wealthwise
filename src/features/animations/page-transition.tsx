import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence, type Easing } from 'motion/react'

const easeOut: Easing = [0, 0, 0.2, 1]

const variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.18, ease: easeOut }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
