<script setup lang="ts">
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()

function cellStyleClass(char: string) {
  if (!char) return 'bg-[#111113] border-[#1e1e20] text-transparent'
  const code = char.charCodeAt(0)
  if (code >= 65 && code <= 90) {
    return 'bg-[#750d37]/20 border-[#750d37]/60 text-white font-bold'
  }
  if (code >= 97 && code <= 122) {
    return 'bg-[#3d8b5e]/20 border-[#3d8b5e]/60 text-[#c3ead2] font-bold'
  }
  return 'bg-[#4a7ebb]/20 border-[#4a7ebb]/60 text-[#d2e4fa] font-bold'
}

const useCases = [
  { name: 'DOOR LOCK', desc: 'Vault & Smart Entry Security' },
  { name: 'WEBSITE PASSWORD', desc: 'Web App & SSO Authentication' },
  { name: 'DESKTOP APP PASSWORD', desc: 'Enterprise Workstation Lock' },
  { name: 'IOT DEVICE PASSWORD', desc: 'Smart Home & Camera Gateway' },
  { name: 'LOCKER PASSWORD', desc: 'Physical & Digital Safe Access' },
  { name: 'MOBILE APP PASSWORD', desc: 'Biometric Fallback App Lock' },
]

defineExpose({ resetShadowWatchLogin: authStore.initGrid })
</script>

<template>
  <section id="logiclock" class="py-8 md:py-14 px-4 md:px-10 border-t border-[#1e1e20] bg-[#111113] relative overflow-hidden">
    <div class="max-w-7xl mx-auto space-y-6">
      
      <!-- Section Title Header -->
      <div class="flex flex-col items-center text-center mb-4">
        <div class="section-tag mb-1.5">// LOGIC LOCK AUTHENTICATION GATEWAY</div>
        <h2 class="text-xl md:text-3xl font-black uppercase tracking-tight text-white">
          9×9 ASCII MATRIX <span style="color: #750d37">SECURITY ARCHITECTURE.</span>
        </h2>
        <p class="text-[#c8c8cc] text-xs md:text-sm max-w-2xl mt-1 font-mono">
          Dynamic coordinate-based authentication with zero password storage.
        </p>
      </div>

      <!-- 2-Column Split: Height Leveled Logic Lock Matrix on Left, Pros & Use Cases on Right -->
      <div class="grid lg:grid-cols-12 gap-6 items-stretch">
        
        <!-- LEFT COLUMN: Compact 9x9 ASCII Matrix Logic Lock (Size Reduced to Match Right Side) -->
        <div class="lg:col-span-6 industrial-card p-3.5 md:p-5 flex flex-col justify-between">
          <div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2.5 border-b border-[#1e1e20] font-mono text-xs">
              <div class="flex items-center gap-2 w-full sm:w-auto">
                <span class="text-[#750d37] font-bold tracking-widest text-[10px] md:text-xs">// SYS_IDENTITY:</span>
                <input
                  v-model="authStore.operatorId"
                  type="text"
                  class="bg-[#0a0a0c] border border-[#1e1e20] px-2 py-0.5 text-white font-mono text-xs focus:outline-none focus:border-[#750d37] uppercase font-bold flex-1 sm:flex-none"
                />
              </div>
              <button
                @click="authStore.initGrid"
                class="industrial-btn industrial-btn-outline text-[9px] py-0.5 px-2 self-end sm:self-auto"
              >
                RE-GENERATE
              </button>
            </div>

            <!-- PHASE 1: Compact 9x9 ASCII Grid -->
            <div v-if="authStore.loginPhase === 'grid'" class="space-y-2.5 mt-2.5">
              <div class="text-center font-mono text-xs space-y-0.5">
                <p class="text-[#c8c8cc] uppercase font-bold tracking-wider text-[10px] md:text-xs">// 9×9 MATRIX SECURITY KEY</p>
                <p class="text-[9px] md:text-[10px] text-[#88888c]">81 DYNAMIC ASCII COORDINATES (A-I, 1-9)</p>
              </div>

              <!-- Matrix Container -->
              <div class="overflow-x-auto pb-1">
                <div class="min-w-[280px] md:min-w-[320px] flex flex-col gap-0.5 font-mono text-xs mx-auto">
                  <div class="grid grid-cols-[1.25rem_repeat(9,1fr)] md:grid-cols-[1.5rem_repeat(9,1fr)] gap-0.5 text-center font-bold text-[#750d37]">
                    <div></div>
                    <div v-for="col in 9" :key="'col-' + col" class="py-0.5 uppercase text-[9px] md:text-[10px]">{{ col }}</div>
                  </div>

                  <div v-for="rowIdx in 9" :key="'row-' + rowIdx" class="grid grid-cols-[1.25rem_repeat(9,1fr)] md:grid-cols-[1.5rem_repeat(9,1fr)] gap-0.5 items-center">
                    <div class="text-center font-bold text-[#750d37] uppercase text-[9px] md:text-[10px]">
                      {{ String.fromCharCode(64 + rowIdx) }}
                    </div>

                    <div
                      v-for="colIdx in 9"
                      :key="'cell-' + rowIdx + '-' + colIdx"
                      class="aspect-square flex items-center justify-center font-mono text-[11px] md:text-sm font-bold border transition-all duration-200 select-none shadow-sm cursor-default hover:scale-105"
                      :class="cellStyleClass(authStore.matrix81Cells[(rowIdx - 1) * 9 + (colIdx - 1)] || '')"
                    >
                      {{ authStore.matrix81Cells[(rowIdx - 1) * 9 + (colIdx - 1)] || '' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- PHASE 2: Compact Rounds Challenge -->
            <div v-else-if="authStore.loginPhase === 'rounds'" class="space-y-2.5 mt-2.5 animate-fade-in">
              <div class="text-center font-mono text-xs space-y-0.5">
                <span class="text-[#750d37] font-bold tracking-widest uppercase">// ROUND {{ authStore.currentRound + 1 }} / 3</span>
                <p class="text-[#c8c8cc] text-[10px] md:text-xs">DOES HIGHLIGHTED COORDINATE MATCH YOUR KEY NUMBER?</p>
              </div>

              <div class="overflow-x-auto pb-1">
                <div class="min-w-[280px] md:min-w-[320px] flex flex-col gap-0.5 font-mono text-xs mx-auto">
                  <div class="grid grid-cols-[1.25rem_repeat(9,1fr)] md:grid-cols-[1.5rem_repeat(9,1fr)] gap-0.5 text-center font-bold text-[#750d37]">
                    <div></div>
                    <div v-for="col in 9" :key="'rcol-' + col" class="py-0.5 uppercase text-[9px] md:text-[10px]">{{ col }}</div>
                  </div>

                  <div v-for="rowIdx in 9" :key="'rrow-' + rowIdx" class="grid grid-cols-[1.25rem_repeat(9,1fr)] md:grid-cols-[1.5rem_repeat(9,1fr)] gap-0.5 items-center">
                    <div class="text-center font-bold text-[#750d37] uppercase text-[9px] md:text-[10px]">
                      {{ String.fromCharCode(64 + rowIdx) }}
                    </div>

                    <div
                      v-for="colIdx in 9"
                      :key="'rcell-' + rowIdx + '-' + colIdx"
                      class="aspect-square flex items-center justify-center font-mono text-[11px] md:text-sm font-bold border transition-all duration-200 select-none shadow-sm cursor-default bg-[#0a0a0c] border-[#1e1e20] text-[#e8e8ea]"
                      :class="{ 'border-[#750d37] bg-[#750d37]/30 text-white scale-105 font-black': (rowIdx - 1) * 9 + (colIdx - 1) === (authStore.currentRound * 27) % 81 }"
                    >
                      {{ authStore.roundGridNumbers[(rowIdx - 1) * 9 + (colIdx - 1)] || '0' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- PHASE 3: Logged In -->
            <div v-else-if="authStore.loginPhase === 'logged-in'" class="py-3 space-y-3 text-center animate-fade-in mt-2">
              <div class="p-3 bg-[#3d8b5e]/15 border border-[#3d8b5e] space-y-1">
                <div class="font-mono text-[10px] text-[#3d8b5e] font-bold uppercase tracking-widest">// SESSION ACTIVE</div>
                <div class="text-base md:text-xl font-black text-white uppercase tracking-tight">SUCCESSFULLY LOGGED IN</div>
                <p class="font-mono text-[10px] text-[#c8c8cc]">
                  SHADOWVERSE SOVEREIGN CLOUD ACTIVE
                </p>
              </div>
            </div>
          </div>

          <!-- Bottom Button -->
          <div class="pt-2 border-t border-[#1e1e20] mt-3">
            <template v-if="authStore.loginPhase === 'grid'">
              <button
                @click="authStore.startAuthenticateRounds"
                :disabled="authStore.isSubmitting"
                class="industrial-btn industrial-btn-primary w-full py-2.5 text-xs font-bold"
              >
                <span v-if="authStore.isSubmitting">INITIALIZING VERIFICATION...</span>
                <span v-else>AUTHENTICATE LOGIC LOCK</span>
              </button>
            </template>

            <template v-else-if="authStore.loginPhase === 'rounds'">
              <div class="flex gap-2">
                <button @click="authStore.answerRound(true)" class="industrial-btn industrial-btn-primary flex-1 py-2 text-xs">
                  YES [MATCH]
                </button>
                <button @click="authStore.answerRound(false)" class="industrial-btn industrial-btn-outline flex-1 py-2 text-xs border-[#c44a4a] text-white">
                  NO [NO MATCH]
                </button>
              </div>
            </template>

            <template v-else-if="authStore.loginPhase === 'logged-in'">
              <button @click="authStore.logout" class="industrial-btn industrial-btn-outline w-full text-xs py-2 border-[#c44a4a] text-white">
                LOGOUT SESSION
              </button>
            </template>
          </div>
        </div>

        <!-- RIGHT COLUMN: Pros & Use Cases (Matching Height) -->
        <div class="lg:col-span-6 flex flex-col justify-between space-y-4">
          
          <!-- Key Advantages / Pros Panel -->
          <div class="industrial-card p-3.5 md:p-4 space-y-2.5 font-mono text-xs">
            <div class="text-[11px] md:text-xs text-[#750d37] font-bold uppercase tracking-widest pb-1.5 border-b border-[#1e1e20]">
              // LOGIC LOCK PROS & ADVANTAGES
            </div>

            <div class="space-y-2">
              <div class="p-2 bg-[#0a0a0c] border border-[#1e1e20] space-y-0.5">
                <span class="text-white font-bold block text-[11px]">// ZERO PASSWORD STORAGE</span>
                <p class="text-[#c8c8cc] text-[10px]">No static passwords or hashes stored on server. Impossibility of credential leaks or database breaches.</p>
              </div>

              <div class="p-2 bg-[#0a0a0c] border border-[#1e1e20] space-y-0.5">
                <span class="text-[#3d8b5e] font-bold block text-[11px]">// SHOULDER-SURFING PROOF</span>
                <p class="text-[#c8c8cc] text-[10px]">Dynamic 9×9 matrix changes coordinates every round. Onlookers cannot deduce your secret key.</p>
              </div>

              <div class="p-2 bg-[#0a0a0c] border border-[#1e1e20] space-y-0.5">
                <span class="text-[#4a7ebb] font-bold block text-[11px]">// KEYLOGGER RESISTANT</span>
                <p class="text-[#c8c8cc] text-[10px]">No text keystrokes submitted. Mouse/touch clicks only verify relative matrix coordinates.</p>
              </div>
            </div>
          </div>

          <!-- Real-World Use Cases Grid -->
          <div class="industrial-card p-3.5 md:p-4 space-y-2.5 font-mono text-xs">
            <div class="text-[11px] md:text-xs text-[#3d8b5e] font-bold uppercase tracking-widest pb-1.5 border-b border-[#1e1e20]">
              // REAL-WORLD USE CASES
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="uc in useCases"
                :key="uc.name"
                class="p-2 bg-[#0a0a0c] border border-[#1e1e20] hover:border-[#750d37] transition-all space-y-0.5"
              >
                <div class="text-white font-bold text-[10px] md:text-[11px] leading-tight">{{ uc.name }}</div>
                <div class="text-[#88888c] text-[9px] md:text-[10px]">{{ uc.desc }}</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </section>
</template>
