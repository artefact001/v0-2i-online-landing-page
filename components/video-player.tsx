'use client'

import { useRef, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react'

interface VideoPlayerProps {
  videoUrl: string
  lessonId: string
  studentId?: string
  title?: string
  duration?: number
}

export function VideoPlayer({
  videoUrl,
  lessonId,
  studentId,
  title,
  duration,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const supabase = createClient()
  
  let controlsTimeout: NodeJS.Timeout

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = async () => {
      setCurrentTime(video.currentTime)

      // Save progress periodically (every 30 seconds)
      if (studentId && Math.floor(video.currentTime) % 30 === 0) {
        try {
          const { data: existing } = await supabase
            .from('lesson_progress')
            .select('id')
            .eq('student_id', studentId)
            .eq('lesson_id', lessonId)
            .single()

          if (existing) {
            await supabase
              .from('lesson_progress')
              .update({
                watch_time_seconds: Math.floor(video.currentTime),
                last_position_seconds: Math.floor(video.currentTime),
              })
              .eq('student_id', studentId)
              .eq('lesson_id', lessonId)
          } else {
            await supabase
              .from('lesson_progress')
              .insert({
                student_id: studentId,
                lesson_id: lessonId,
                watch_time_seconds: Math.floor(video.currentTime),
                last_position_seconds: Math.floor(video.currentTime),
              })
          }
        } catch (error) {
          console.error('Error saving progress:', error)
        }
      }
    }

    const handleLoadedMetadata = () => {
      setTotalTime(video.duration)
    }

    const handleEnded = async () => {
      setIsPlaying(false)
      
      // Mark as completed if student watched 90% or more
      if (studentId && video.currentTime / video.duration >= 0.9) {
        try {
          const { data: existing } = await supabase
            .from('lesson_progress')
            .select('id')
            .eq('student_id', studentId)
            .eq('lesson_id', lessonId)
            .single()

          if (existing) {
            await supabase
              .from('lesson_progress')
              .update({
                is_completed: true,
                completed_at: new Date().toISOString(),
                watch_time_seconds: Math.floor(video.duration),
              })
              .eq('student_id', studentId)
              .eq('lesson_id', lessonId)
          }
        } catch (error) {
          console.error('Error marking as completed:', error)
        }
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
    }
  }, [videoRef, lessonId, studentId, supabase])

  const togglePlayPause = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return
    const time = parseFloat(e.target.value)
    videoRef.current.currentTime = time
    setCurrentTime(time)
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!isFullscreen) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    clearTimeout(controlsTimeout)
    controlsTimeout = setTimeout(() => setShowControls(false), 3000)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-lg overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-auto block"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        crossOrigin="anonymous"
      />

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max={totalTime || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-[rgba(255,255,255,0.2)] rounded-full cursor-pointer appearance-none accent-[#C9A227] mb-3"
          style={{
            background: `linear-gradient(to right, #C9A227 0%, #C9A227 ${
              (currentTime / totalTime) * 100
            }%, rgba(255,255,255,0.2) ${(currentTime / totalTime) * 100}%, rgba(255,255,255,0.2) 100%)`,
          }}
        />

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={togglePlayPause}
              className="p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Mute */}
            <button
              onClick={toggleMute}
              className="p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Time */}
            <span className="text-white text-sm ml-2">
              {formatTime(currentTime)} / {formatTime(totalTime)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Settings */}
            <button className="p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors" title="Settings">
              <Settings className="w-5 h-5 text-white" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <Maximize className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Play Button Overlay */}
      {!isPlaying && (
        <button
          onClick={togglePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
        >
          <div className="w-16 h-16 bg-[#C9A227]/80 rounded-full flex items-center justify-center hover:bg-[#C9A227] transition-colors">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </button>
      )}

      {/* Title Overlay */}
      {title && showControls && (
        <div className="absolute top-4 left-4 right-4 text-white">
          <p className="font-semibold text-sm">{title}</p>
        </div>
      )}
    </div>
  )
}
