import { motion } from 'framer-motion'

// https://fireship.io/lessons/framer-motion-modal/
export function Backdrop({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            className="fixed inset-0 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-500 bg-opacity-20 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {children}
        </motion.div>
    )
}
