import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Share2, Copy, Check, Link, Mail, 
  Twitter, Facebook, MessageSquare, X
} from 'lucide-react'
import { timetableAPI } from '../services/api'

export default function ShareTimetable({ versionId: propVersionId, onClose }) {
  const { id: urlVersionId } = useParams()
  const versionId = propVersionId || urlVersionId
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [shareData, setShareData] = useState(null)
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    if (versionId) {
      generateShareLink()
    }
  }, [versionId])

  const generateShareLink = async () => {
    try {
      setLoading(true)
      const response = await timetableAPI.createShareLink(versionId)
      setShareData(response.data)
      const baseUrl = window.location.origin
      setShareUrl(`${baseUrl}/share/${response.data.share_code}`)
    } catch (error) {
      console.error('Error generating share link:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleShare = async (platform) => {
    const text = `Check out this timetable!`
    const url = shareUrl

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      email: `mailto:?subject=${encodeURIComponent('Shared Timetable')}&body=${encodeURIComponent(text + '\n\n' + url)}`
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shared Timetable',
          text: 'Check out this timetable!',
          url: shareUrl
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-white">Generating share link...</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Share2 className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Share Timetable</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Share Link */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Share Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:outline-none"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Share Info */}
          {shareData && (
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Link className="w-4 h-4" />
                <span>Share Code: {shareData.share_code}</span>
              </div>
              {shareData.expires_at && (
                <p className="text-gray-500 text-xs mt-2">
                  Expires: {new Date(shareData.expires_at).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Share Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">
              Share on
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { platform: 'twitter', icon: Twitter, label: 'Twitter', color: 'bg-sky-500' },
                { platform: 'facebook', icon: Facebook, label: 'Facebook', color: 'bg-blue-600' },
                { platform: 'whatsapp', icon: MessageSquare, label: 'WhatsApp', color: 'bg-green-500' },
                { platform: 'email', icon: Mail, label: 'Email', color: 'bg-gray-500' }
              ].map(({ platform, icon: Icon, label, color }) => (
                <motion.button
                  key={platform}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare(platform)}
                  className={`${color} rounded-xl p-3 flex flex-col items-center gap-1 hover:opacity-90 transition-opacity`}
                >
                  <Icon className="w-5 h-5 text-white" />
                  <span className="text-white text-xs">{label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Native Share (Mobile) */}
          {navigator.share && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNativeShare}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share via Device
            </motion.button>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <p className="text-gray-500 text-xs text-center">
            Anyone with the link can view this timetable version
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
