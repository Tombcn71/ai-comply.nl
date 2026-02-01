"use client"

import { useEffect, useState } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(): TimeLeft {
  const deadline = new Date("2026-08-02T00:00:00")
  const now = new Date()
  const difference = deadline.getTime() - now.getTime()

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="inline-flex min-w-[2ch] justify-center rounded bg-white/20 px-1.5 py-0.5 font-mono text-sm font-bold tabular-nums text-white sm:min-w-[2.5ch] sm:px-2 sm:text-base">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-xs text-slate-300 sm:text-sm">{label}</span>
    </div>
  )
}

export function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-slate-900 py-2">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 text-center sm:gap-x-4">
        <span className="text-xs font-medium text-white sm:text-sm">
          EU AI-verordening van kracht over
        </span>
        {timeLeft !== null ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <TimeUnit value={timeLeft.days} label="dagen" />
            <span className="text-white/50">:</span>
            <TimeUnit value={timeLeft.hours} label="h" />
            <span className="text-white/50">:</span>
            <TimeUnit value={timeLeft.minutes} label="m" />
            <span className="text-white/50">:</span>
            <TimeUnit value={timeLeft.seconds} label="s" />
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex min-w-[2ch] justify-center rounded bg-white/20 px-1.5 py-0.5 font-mono text-sm font-bold tabular-nums text-white sm:min-w-[2.5ch] sm:px-2 sm:text-base">
              --
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
