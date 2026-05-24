import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, ArrowLeft } from 'lucide-react'
import { getSharedChat } from '../api/moonai'
import MessageBubble from '../components/chat/MessageBubble'
import Spinner from '../components/ui/Spinner'

const MoonLogo = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 1024 1024"
    style={{ filter: 'drop-shadow(0 0 20px var(--primary-transparent))' }}
  >
    <path fill="var(--primary-color)" d="M589.090759,165.440460 C589.857056,171.388962 586.072571,174.014038 582.015320,176.120468 C572.702698,180.955185 563.217468,185.456161 553.877258,190.239044 C513.945312,210.687241 480.423676,238.327866 456.827301,277.044739 C441.094421,302.859222 431.573486,330.882355 427.328003,360.737396 C425.313385,374.904419 424.037048,389.129852 424.262177,403.476593 C424.982880,449.402313 436.764282,492.251831 460.279694,531.708496 C485.251526,573.608887 519.317810,605.776794 563.861755,626.242981 C583.467590,635.251038 604.016785,641.099243 625.513977,643.924255 C638.970093,645.692688 652.421326,646.247742 665.866821,645.619690 C719.931458,643.094177 768.919739,626.480347 811.317383,592.095093 C815.456848,588.737915 819.583069,585.352112 823.884216,582.210754 C826.775940,580.098755 829.996277,578.503723 833.506409,581.155640 C836.995239,583.791504 837.761414,587.412231 836.767151,591.412537 C834.668335,599.857178 831.231384,607.831970 827.434387,615.606445 C801.834106,668.024353 764.486755,710.098328 715.861877,742.293518 C680.074402,765.988770 640.977539,781.346680 598.856262,788.995605 C571.383911,793.984436 543.641357,795.139648 515.850342,792.371399 C438.538605,784.670105 371.032837,754.356384 313.882843,702.032227 C264.882568,657.169617 232.851212,601.893860 218.121033,536.906677 C212.734177,513.140808 210.088257,489.012421 210.831177,464.650818 C212.766388,401.191437 231.023453,343.251160 269.749847,292.297943 C299.164825,253.595993 334.537079,221.611725 376.876953,197.662476 C411.369232,178.152130 448.218964,164.912933 487.465698,158.837402 C516.549866,154.335037 545.752197,153.735703 574.940002,157.809387 C580.239563,158.549057 586.007690,159.364197 589.090759,165.440460 M503.487366,759.822205 C510.056763,760.780090 516.599304,762.254028 523.200684,762.597839 C542.141357,763.584412 561.069946,763.408447 579.916504,760.698547 C611.605530,756.142273 641.936768,747.179016 670.858765,733.394836 C710.994568,714.266174 745.199707,687.358337 774.850830,654.449524 C778.302490,650.618652 781.622986,646.645508 784.714111,642.520935 C787.749512,638.470703 791.535828,634.892578 793.610107,629.567688 C791.328064,630.977539 789.427856,632.022949 787.662781,633.261047 C751.420288,658.682373 710.496826,670.286072 666.920105,673.093933 C640.383179,674.803772 613.900635,672.424072 588.448242,664.441467 C553.370789,653.440186 518.513672,641.698425 483.786346,629.628845 C445.637268,616.369934 410.325623,597.619629 377.637024,573.732910 C367.962006,566.663025 360.814270,559.272827 360.145355,546.714233 C359.841827,541.015747 358.179688,535.389526 358.939056,528.316650 C377.762909,544.532654 396.485443,559.337280 417.385010,571.160828 C438.283661,582.983887 459.809052,593.349121 483.610657,602.106262 C438.008453,561.702759 413.102264,511.301544 402.144379,453.994415 C391.107330,396.273346 399.310791,340.721710 427.195709,288.373993 C425.144135,289.806549 423.565094,291.296844 422.305054,293.020355 C411.075592,308.379913 400.968903,324.459656 392.581757,341.536194 C363.999756,399.730164 350.837433,461.116974 354.136719,526.037598 C355.280670,548.546692 358.327362,570.730652 363.488770,592.569519 C373.906281,636.647705 391.038971,677.587158 420.092072,713.097412 C441.705811,739.514771 468.647766,755.647766 503.487366,759.822205 M299.188477,361.290619 C297.731323,375.731232 298.025482,390.142151 299.201355,404.609467 C300.969055,426.357819 305.999176,447.253052 314.544434,467.277771 C318.173248,475.781372 322.467682,483.992462 328.246155,492.436218 C335.293243,349.754608 409.357483,250.718948 526.911621,179.338074 C515.080383,178.836960 503.505402,181.491196 491.973663,183.756409 C437.869354,194.384247 389.029175,216.444031 346.888641,252.336731 C332.461548,264.624847 318.679993,277.311768 312.668793,296.680206 C306.185547,317.569763 300.458710,338.444183 299.188477,361.290619 M241.415588,486.045166 C242.412964,493.947601 243.170578,501.889008 244.447983,509.745941 C251.033264,550.249756 265.667786,587.691406 288.205597,621.936829 C307.910278,651.877380 332.932281,676.885864 361.383545,698.507874 C368.861328,704.190735 376.428833,709.845581 385.711395,714.430176 C385.158447,713.021362 385.040985,712.388000 384.703308,711.910339 C374.949280,698.111511 367.385529,683.136597 360.585449,667.712036 C343.184235,628.241028 332.485443,587.116455 329.679199,544.015198 C329.430939,540.202454 328.083008,537.127563 325.565033,534.159790 C294.346771,497.364410 276.117401,454.999054 272.943024,406.765167 C270.962311,376.668304 273.656677,346.899445 284.600922,318.357666 C285.196411,316.804657 286.228821,315.135742 285.008392,313.021057 C281.782501,315.554321 280.591705,319.128998 278.723816,322.185608 C257.572479,356.797607 247.289093,394.957703 242.342880,434.791534 C240.267441,451.505829 240.867813,468.323456 241.415588,486.045166 z"/>
  </svg>
)

export default function SharedChatPage() {
  const { shareId } = useParams()
  const [chat, setChat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getSharedChat(shareId)
      .then(setChat)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [shareId])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Floating Two Island Top Bar */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'transparent',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {/* Left Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'var(--bg-elevated)',
            padding: '6px 16px 6px 6px',
            borderRadius: '999px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
            pointerEvents: 'auto',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--bg-hover)',
              border: 'none',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
          >
            <ArrowLeft size={16} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', paddingRight: 4 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--text-secondary)',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {chat ? chat.title : 'Loading...'}
            </span>
          </div>
        </div>

        {/* Right Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-elevated)',
            padding: '2px',
            borderRadius: '999px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
            pointerEvents: 'auto',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
              border: 'none',
              borderRadius: '999px',
              color: 'white',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              boxShadow: '0 2px 12px rgba(124,58,237,0.4)',
              flexShrink: 0,
            }}
          >
            <ExternalLink size={13} />
            Continue in App
          </Link>
        </div>
      </header>
      {/* Content */}
      <div style={{ flex: 1, maxWidth: 760, margin: '0 auto', width: '100%', padding: '80px 20px 24px' }}>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <Spinner size={36} />
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🌑</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
              Shared chat not found or has expired.
            </div>
          </div>
        )}

        {chat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            {chat.messages?.map((msg, i) => {
              const prevMsg = chat.messages[i - 1]
              return (
                <MessageBubble
                  key={i}
                  message={{ ...msg, id: String(i), timestamp: msg.createdAt || new Date().toISOString() }}
                  isFirst={!prevMsg || prevMsg.role !== msg.role}
                  readonly={true}
                />
              )
            })}
          </motion.div>
        )}
      </div>

      {/* Read-only footer */}
      <div
        style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
          color: 'var(--text-tertiary)',
          fontSize: 13,
        }}
      >
        This is a read-only shared conversation from Moon AI •{' '}
        <Link to="/" style={{ color: 'var(--primary-color)' }}>Start your own chat →</Link>
      </div>
    </div>
  )
}
