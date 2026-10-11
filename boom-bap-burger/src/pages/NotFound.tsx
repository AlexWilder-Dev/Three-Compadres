import { motion } from 'framer-motion'
import { BoomButton } from '../components/BoomButton'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import './NotFound.css'

export function NotFound() {
  useDocumentTitle('Track not found')
  return (
    <section className="not-found">
      <div className="wrap not-found__inner">
        <motion.p
          className="not-found__code"
          initial={{ rotate: -20, scale: 0.6, opacity: 0 }}
          animate={{ rotate: [-20, 6, -3, 0], scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          aria-hidden="true"
        >
          404
        </motion.p>
        <h1 className="h-lg">Record scratch. That track doesn’t exist.</h1>
        <div className="not-found__actions">
          <BoomButton to="/">Back to the top</BoomButton>
          <BoomButton to="/menu" variant="ghost">
            See the menu
          </BoomButton>
        </div>
      </div>
    </section>
  )
}
