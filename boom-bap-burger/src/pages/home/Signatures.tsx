import { Link } from 'react-router'
import { motion, type Variants } from 'framer-motion'
import { aSide, dietLabels, signatureIds, type MenuItem } from '../../data/venue'
import { BurgerArt } from '../../components/BurgerArt'
import { ArrowRight } from '../../components/Icons'
import { SectionHead } from '../../components/SectionHead'
import { formatPrice } from '../../lib/format'
import { rise, spring } from '../../lib/motion'
import './Signatures.css'

const signatures = signatureIds
  .map((id) => aSide.find((item) => item.id === id))
  .filter((item): item is MenuItem => !!item)

const card: Variants = {
  ...rise,
  hover: { y: -8, transition: spring },
}

export function Signatures() {
  return (
    <section className="section signatures" aria-labelledby="signatures-title">
      <div className="wrap">
        <SectionHead
          eyebrow="The greatest hits"
          id="signatures-title"
          title="Signature burgers"
          lede="28-day aged beef, double cheese and a sauce with our name on it."
          aside={
            <Link className="text-link" to="/menu">
              Full tracklist <ArrowRight />
            </Link>
          }
        />
        <ol className="signatures__grid">
          {signatures.map((item, i) => (
            <motion.li
              key={item.id}
              className={`sig-card${item.signature ? ' sig-card--feature' : ''}`}
              variants={card}
              initial="hidden"
              whileInView="show"
              whileHover="hover"
              viewport={{ once: true, amount: 0.3 }}
            >
              <Link to={`/menu?track=${item.id}`} className="sig-card__link">
                <span className="sig-card__no" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="sig-card__art">{item.layers && <BurgerArt layers={item.layers} />}</div>
                <div className="sig-card__body">
                  <div className="sig-card__tags">
                    {item.signature && <span className="tag tag--amber">Signature</span>}
                    {item.diet?.map((d) => (
                      <span key={d} className="tag">
                        {dietLabels[d]}
                      </span>
                    ))}
                  </div>
                  <h3 className="sig-card__name">{item.name}</h3>
                  <p className="sig-card__desc">{item.description}</p>
                  <p className="sig-card__price">{formatPrice(item.price)}</p>
                </div>
              </Link>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
