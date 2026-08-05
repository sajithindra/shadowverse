import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CameraFeed {
  id: string
  place: string
  purpose: string
  status: 'LIVE' | 'OFFLINE'
  agent: string
  fps: number
  resolution: string
  manufacturer: string
  latency: string
}

export interface TelemetryLogEvent {
  time: string
  tag: 'CRITICAL' | 'ALERT' | 'WARNING' | 'INFO'
  agent: string
  msg: string
}

export const useCameraStore = defineStore('camera', () => {
  const cameraFilter = ref<string>('ALL')
  const activeModalCam = ref<CameraFeed | null>(null)

  const cameras = ref<CameraFeed[]>([
    { id: 'CAM-001', place: 'MAIN GATE OUTER', purpose: 'Perimeter Boundary', status: 'LIVE', agent: 'INTRUDER ALERT', fps: 30, resolution: '4K UHD', manufacturer: 'HIKVISION', latency: '12ms' },
    { id: 'CAM-007', place: 'SERVER VAULT 01', purpose: 'Access Control', status: 'LIVE', agent: 'UNAUTHORIZED ENTRY', fps: 30, resolution: '1080p HD', manufacturer: 'DAHUA', latency: '14ms' },
    { id: 'CAM-014', place: 'LIVING ROOM', purpose: 'Elder Fall Monitor', status: 'LIVE', agent: 'FALL DETECTION', fps: 30, resolution: '4K UHD', manufacturer: 'AXIS', latency: '8ms' },
    { id: 'CAM-022', place: 'WASHROOM CORRIDOR', purpose: 'Timeout Monitor', status: 'LIVE', agent: 'WASHROOM ALERT', fps: 25, resolution: '1080p HD', manufacturer: 'CP PLUS', latency: '18ms' },
    { id: 'CAM-031', place: 'EXECUTIVE FLOOR 3', purpose: 'Behaviour & Pet Log', status: 'LIVE', agent: 'PET & BEHAVIOUR TRACKER', fps: 30, resolution: '2K QHD', manufacturer: 'ONVIF RTSP', latency: '10ms' },
    { id: 'CAM-045', place: 'RECEPTION LOBBY', purpose: 'Visitor Risk Profiling', status: 'LIVE', agent: 'VISITOR RISK AI', fps: 30, resolution: '4K UHD', manufacturer: 'HANWHA', latency: '11ms' },
  ])

  const eventLogs = ref<TelemetryLogEvent[]>([
    { time: '00:03:14', tag: 'CRITICAL', agent: 'FALL_DETECTOR', msg: 'FALL DETECTED — Living Room / CAM-014 — Ambulance Dispatch Triggered' },
    { time: '22:47:03', tag: 'ALERT', agent: 'INTRUDER_AI', msg: 'UNREGISTERED VISITOR — Outer Gate / 22:47 — Owner Notified via Call' },
    { time: '14:22:11', tag: 'WARNING', agent: 'BEHAVIOUR_LOG', msg: 'RESTRICTED PHONE USE — Server Vault / CAM-007 — Event Saved to Audit Log' },
    { time: '11:05:44', tag: 'INFO', agent: 'PET_TRACKER', msg: 'PET MOVEMENT LOGGED — Zone B to Lounge — Normal Activity' },
    { time: '09:31:07', tag: 'ALERT', agent: 'WASHROOM_MONITOR', msg: 'WASHROOM TIMEOUT EXCEEDED — 18 min 32 sec — Emergency Alert Sent' },
    { time: '08:14:55', tag: 'INFO', agent: 'VISITOR_AI', msg: 'REPEAT VISITOR MATCHED — ARJUN MEHTA (Visit #12) — Risk Level: LOW' },
  ])

  const filteredCameras = computed(() => {
    if (cameraFilter.value === 'ALL') return cameras.value
    return cameras.value.filter(c => c.agent.includes(cameraFilter.value))
  })

  function selectCameraForInspection(cam: CameraFeed | null) {
    activeModalCam.value = cam
  }

  function setFilter(filter: string) {
    cameraFilter.value = filter
  }

  return {
    cameraFilter,
    cameras,
    eventLogs,
    activeModalCam,
    filteredCameras,
    selectCameraForInspection,
    setFilter,
  }
})
