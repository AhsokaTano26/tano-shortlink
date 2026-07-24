<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'

const props = defineProps({
  page: {
    type: String,
    default: 'home'
  }
})

const linkMap = {
  github: 'https://github.com/AhsokaTano26',
  bili: 'https://space.bilibili.com/435530511',
  blog: 'https://www.tano.asia'
}

const pageClass = computed(() => `page-${props.page}`)
const timeText = ref('')
const dateText = ref('')
const statsOpen = ref(false)
const statsText = ref([])
let timerId = null
let redirectId = null

// 以后改主页内容，优先只改这个配置块。
const siteContent = {
  backgroundUrl: '/2043253.jpg',
  avatarUrl:
    '/aimi.png',
  intro: 'Hello! 欢迎来到我的小站...',
  mottoTitle: '一言',
  mottoText: '好梦向来易醒。',
  mottoAuthor: '—— 风之谷',
  clockTitle: '时钟',
  navItems: [
    { label: '博客', href: '/go.html?to=blog' },
    { label: '网盘', href: '/go.html?to=github' },
    { label: '图床', href: '/go.html?to=bili' },
    { label: '音乐', href: '/go.html?to=blog' },
    { label: '导航', href: '/go.html?to=blog' }
  ],
  socialItems: [
    {
      label: 'GitHub',
      href: 'https://github.com/AhsokaTano26',
      icon: 'mdi:github'
    },
    {
      label: 'Bilibili',
      href: 'https://space.bilibili.com/435530511',
      icon: 'simple-icons:bilibili'
    },
    {
      label: 'Blog',
      href: '/go.html?to=blog',
      icon: 'mdi:book-open-page-variant-outline'
    },
    {
      label: '导航',
      href: '/go.html?to=blog',
      icon: 'mdi:compass-outline'
    }
  ]
}

const query = new URLSearchParams(window.location.search)
const jumpKey = query.get('to')
const destination = computed(() => linkMap[jumpKey] || '/404.html')
const validTarget = computed(() => Boolean(linkMap[jumpKey]))

const formatClock = () => {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  dateText.value = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`
  timeText.value = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

const loadStats = () => {
  const stats = JSON.parse(localStorage.getItem('jump_stats') || '{}')
  statsText.value = Object.entries(stats)
    .map(([key, val]) => ({ key, val }))
    .sort((a, b) => b.val - a.val)
}

const toggleStats = () => {
  statsOpen.value = !statsOpen.value
  if (statsOpen.value) loadStats()
}

const closeStats = () => {
  statsOpen.value = false
}

const updateJumpStats = () => {
  if (!validTarget.value) return
  const stats = JSON.parse(localStorage.getItem('jump_stats') || '{}')
  stats[jumpKey] = (stats[jumpKey] || 0) + 1
  localStorage.setItem('jump_stats', JSON.stringify(stats))
}

const setupHome = () => {
  formatClock()
  timerId = window.setInterval(formatClock, 1000)
  requestAnimationFrame(() => {
    gsap.from('.home-avatar', { scale: 0.9, opacity: 0, duration: 0.9, ease: 'power3.out' })
    gsap.from('.home-glass', { y: 26, opacity: 0, duration: 0.8, stagger: 0.1, delay: 0.08, ease: 'power3.out' })
    gsap.from('.home-nav', { y: 20, opacity: 0, duration: 0.7, delay: 0.2, ease: 'power3.out' })
  })
}

const setupGo = () => {
  updateJumpStats()
  requestAnimationFrame(() => {
    const progress = { value: 0 }
    const tl = gsap.timeline({
      onComplete: () => {
        redirectId = window.setTimeout(() => {
          window.location.href = destination.value
        }, 380)
      }
    })

    tl.to('.go-ring', { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' })
      .to(progress, {
        duration: 2.25,
        value: 100,
        ease: 'power3.inOut',
        onUpdate() {
          const el = document.querySelector('.go-percent')
          if (el) el.textContent = `${String(Math.floor(progress.value)).padStart(2, '0')}%`
        }
      }, 0)
      .to('.go-step-2', { opacity: 1, duration: 0.1 }, 0.78)
      .to('.go-step-3', { opacity: 1, duration: 0.1 }, 1.72)
  })
}

const setup404 = () => {
  requestAnimationFrame(() => {
    gsap.to('.notfound-title', { opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(1.7)' })
    gsap.to('.notfound-copy', { opacity: 1, y: 0, duration: 0.7, delay: 0.1 })
    gsap.to('.notfound-btn', { opacity: 1, y: 0, duration: 0.7, delay: 0.25 })
  })
}

onMounted(() => {
  if (props.page === 'home') setupHome()
  if (props.page === 'go') setupGo()
  if (props.page === '404') setup404()
})

onUnmounted(() => {
  if (timerId) window.clearInterval(timerId)
  if (redirectId) window.clearTimeout(redirectId)
})
</script>

<template>
  <div class="app-shell" :class="pageClass">
    <div class="scene scene-layer"></div>
    <div class="scene scene-grid"></div>
    <div class="scene scene-vignette"></div>

    <section v-if="page === 'home'" class="home-layout">
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${siteContent.backgroundUrl})` }"
      >
        <div class="absolute inset-0 bg-slate-950/35"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_12%_86%,rgba(255,214,150,0.14),transparent_14%),radial-gradient(circle_at_84%_18%,rgba(88,156,255,0.15),transparent_16%)]"></div>
      </div>
      <main class="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col justify-center px-4 pb-28 pt-6 md:px-8">
        <section
          class="grid items-center gap-6 lg:grid-cols-[minmax(260px,0.88fr)_1fr_1fr] lg:grid-rows-[minmax(290px,auto)_auto]"
        >
          <div class="home-avatar flex flex-col items-center gap-4 lg:row-span-2">
            <div class="flex items-center gap-4">
              <div
                class="h-32 w-32 overflow-hidden rounded-full border-4 border-white/90 bg-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl"
              >
                <img :src="siteContent.avatarUrl" alt="avatar" class="h-full w-full object-cover" />
              </div>
            </div>

            <div
              class="home-glass w-full rounded-3xl border border-white/20 bg-white/15 px-6 py-5 text-center shadow-[0_16px_45px_rgba(0,0,0,0.22)] backdrop-blur-xl lg:text-left"
            >
              <div class="text-lg font-medium text-white/95">{{ siteContent.intro }}</div>
            </div>

            <div class="flex gap-3">
              <a
                v-for="item in siteContent.socialItems"
                :key="item.label"
                :href="item.href"
                :aria-label="item.label"
                class="grid h-11 w-11 place-items-center rounded-xl border border-white/20 bg-white/10 text-white/90 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20 hover:text-white"
              >
                <Icon :icon="item.icon" class="h-5 w-5" />
              </a>
            </div>
          </div>

          <article
            class="home-glass flex min-h-[14rem] flex-col justify-center rounded-[28px] border border-white/20 bg-white/15 p-7 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl md:p-8"
          >
            <div class="text-center text-xl font-bold tracking-[0.18em] text-white/95">
              {{ siteContent.mottoTitle }}
            </div>
            <p class="mt-6 text-center text-[1.05rem] italic leading-10 text-white/90 md:text-[1.15rem]">
              {{ siteContent.mottoText }}
            </p>
            <div class="mt-6 text-right text-sm text-white/70">{{ siteContent.mottoAuthor }}</div>
          </article>

          <article
            class="home-glass flex min-h-[14rem] flex-col justify-center rounded-[28px] border border-white/20 bg-white/15 p-7 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl md:p-8"
          >
            <div class="text-center text-xl font-bold tracking-[0.18em] text-white/95">
              {{ siteContent.clockTitle }}
            </div>
            <div class="mt-7 text-center">
              <div class="text-lg text-white/70">{{ dateText }}</div>
              <div class="mt-2 text-4xl font-semibold tracking-wide text-white md:text-5xl">
                {{ timeText }}
              </div>
            </div>
          </article>

          <section class="home-nav flex flex-wrap justify-center gap-4 lg:col-span-2 lg:col-start-2">
            <a
              v-for="nav in siteContent.navItems"
              :key="nav.label"
              :href="nav.href"
              class="rounded-2xl border border-white/20 bg-white/15 px-6 py-4 text-center text-base font-medium text-white/95 shadow-[0_12px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:bg-white/22 hover:shadow-[0_16px_36px_rgba(0,0,0,0.24)]"
            >
              {{ nav.label }}
            </a>
          </section>
        </section>
      </main>
    </section>

    <main v-else-if="page === 'go'" class="go-layout">
      <div class="go-orbit">
        <div class="go-ring"></div>
        <div class="go-ring go-ring-alt"></div>
        <div class="go-core">
          <div class="go-percent">00%</div>
          <div class="go-label">Connecting</div>
        </div>
      </div>
      <h1 class="go-title">跳转安全验证</h1>
      <div class="go-logs">
        <p>初始化重定向协议...</p>
        <p class="go-step-2">正在解析目标坐标...</p>
        <p class="go-step-3">握手成功，即将脱离当前维度。</p>
      </div>
    </main>

    <main v-else class="notfound-layout">
      <div class="notfound-grid">
        <div class="notfound-orbit"></div>
        <div class="notfound-panel">
          <h1 class="notfound-title">404</h1>
          <p class="notfound-copy">你闯入了未知的数字荒原，这里只有数据的残骸。</p>
          <a class="notfound-btn" href="/index.html">返回母舰</a>
        </div>
      </div>
    </main>

    <div v-if="page === 'home' && statsOpen" class="stats-overlay" @click.self="closeStats">
      <div class="stats-panel">
        <h3>TRANSMISSION LOGS</h3>
        <div class="stats-list">
          <div v-if="statsText.length === 0" class="stats-empty">暂无传输记录</div>
          <div v-for="item in statsText" :key="item.key" class="stats-item">
            <span>{{ item.key.toUpperCase() }}</span>
            <strong>{{ item.val }} CLICKS</strong>
          </div>
        </div>
        <button type="button" class="stats-close" @click="closeStats">关闭看板</button>
      </div>
    </div>
  </div>
</template>

<style>
.app-shell {
  position: relative;
  min-height: 100vh;
  color: var(--text);
}

.scene {
  position: fixed;
  inset: 0;
  pointer-events: none;
}

.scene-layer {
  background:
    radial-gradient(circle at 50% 42%, rgba(255, 255, 255, 0.08), transparent 32%),
    radial-gradient(circle at 16% 80%, rgba(255, 223, 150, 0.14), transparent 16%),
    radial-gradient(circle at 83% 18%, rgba(74, 156, 255, 0.16), transparent 16%),
    linear-gradient(180deg, rgba(12, 13, 19, 0.12), rgba(10, 12, 18, 0.7));
}

.scene-grid {
  opacity: 0.12;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0 1px, transparent 1px 100%),
    linear-gradient(45deg, rgba(255, 255, 255, 0.03) 0 1px, transparent 1px 100%);
  background-size: 120px 120px, 160px 160px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.85), transparent 92%);
}

.scene-vignette {
  background:
    radial-gradient(circle at 50% 50%, transparent 36%, rgba(0, 0, 0, 0.26) 100%);
}

.home-layout {
  min-height: 100vh;
  position: relative;
  z-index: 1;
  padding: 2.3vh 2.6vw 1.4vh;
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 1rem;
}

.home-frame {
  width: min(100%, 1540px);
  margin: 0 auto;
  align-self: center;
  display: grid;
  gap: 1.25rem;
}

.hero-grid {
  display: grid;
  grid-template-columns: 0.95fr 1.15fr 1.1fr;
  grid-template-areas: "avatar quote clock";
  gap: 2rem;
  align-items: center;
  min-height: 58vh;
}

.hero-art {
  grid-area: avatar;
  position: relative;
  min-height: 33rem;
  display: grid;
  place-items: center;
}

.record {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, rgba(32, 127, 255, 0.86), #141827 58%, #0a0d14 70%);
  box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.05), 0 22px 40px rgba(0, 0, 0, 0.28);
  opacity: 0.9;
}

.record::after {
  content: '';
  position: absolute;
  inset: 18%;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.16);
}

.record-left {
  width: 24rem;
  height: 24rem;
  left: -0.5rem;
  top: 1.8rem;
}

.record-right {
  width: 25rem;
  height: 25rem;
  right: -1.2rem;
  top: 0.2rem;
}

.books {
  position: absolute;
  inset: 0 auto auto 0;
  width: 20rem;
  height: 7.6rem;
  border-radius: 1rem;
  background:
    linear-gradient(90deg,
      rgba(255, 182, 179, 0.85) 0 8%,
      rgba(132, 233, 255, 0.85) 8% 13%,
      rgba(255, 255, 255, 0.6) 13% 22%,
      rgba(163, 214, 255, 0.85) 22% 32%,
      rgba(255, 180, 211, 0.75) 32% 38%,
      rgba(157, 255, 203, 0.7) 38% 46%,
      rgba(255, 255, 255, 0.45) 46% 100%);
  opacity: 0.34;
  filter: blur(0.2px);
}

.avatar-shell {
  position: relative;
  width: min(30vw, 19rem);
  aspect-ratio: 1;
  border-radius: 50%;
  border: 0.34rem solid rgba(255, 255, 255, 0.92);
  background:
    radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.72), transparent 18%),
    radial-gradient(circle at 62% 58%, rgba(255, 206, 126, 0.22), transparent 40%),
    linear-gradient(145deg, #f3b08e 0%, #ef9a6a 44%, #dd895a 100%);
  box-shadow: 0 28px 60px rgba(0, 0, 0, 0.34), inset 0 0 34px rgba(255, 255, 255, 0.16);
  z-index: 2;
}

.avatar-face {
  position: absolute;
  inset: 12%;
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.05));
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.15);
}

.avatar-ears span,
.avatar-eyes span {
  position: absolute;
  display: block;
}

.avatar-ears span:first-child,
.avatar-ears span:last-child {
  top: -3%;
  width: 32%;
  height: 32%;
  border-radius: 42% 42% 16% 16%;
  background: linear-gradient(180deg, #efbe75, #d49152);
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.08);
}

.avatar-ears span:first-child {
  left: 8%;
  transform: rotate(-18deg);
}

.avatar-ears span:last-child {
  right: 8%;
  transform: rotate(18deg);
}

.avatar-eyes span:first-child,
.avatar-eyes span:last-child {
  top: 38%;
  width: 14%;
  height: 14%;
  border-radius: 50%;
  background: radial-gradient(circle, #2d1d17 0 28%, transparent 29%);
}

.avatar-eyes span:first-child {
  left: 29%;
}

.avatar-eyes span:last-child {
  right: 29%;
}

.avatar-nose {
  position: absolute;
  left: 50%;
  top: 51%;
  width: 8%;
  height: 5%;
  transform: translateX(-50%);
  border-radius: 50%;
  background: #67392b;
}

.avatar-muzzle {
  position: absolute;
  left: 50%;
  top: 55%;
  width: 28%;
  height: 18%;
  transform: translateX(-50%);
  border-radius: 50%;
  background: rgba(255, 245, 236, 0.28);
}

.floating-hearts span {
  position: absolute;
  width: 0.9rem;
  height: 0.9rem;
  background: #ee597f;
  transform: rotate(45deg);
  border-radius: 0.2rem 0.2rem 0 0;
  opacity: 0.9;
}

.floating-hearts span::before,
.floating-hearts span::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: inherit;
}

.floating-hearts span::before {
  left: -50%;
}

.floating-hearts span::after {
  top: -50%;
}

.floating-hearts span:nth-child(1) { left: 44%; top: 2%; }
.floating-hearts span:nth-child(2) { left: 56%; top: 6%; transform: scale(0.75) rotate(45deg); }
.floating-hearts span:nth-child(3) { left: 68%; top: 8%; transform: scale(0.6) rotate(45deg); }
.floating-hearts span:nth-child(4) { left: 79%; top: 12%; transform: scale(0.8) rotate(45deg); }

.hero-cards {
  grid-area: quote;
  display: grid;
  gap: 1.2rem;
  align-items: stretch;
}

.glass-card {
  background: linear-gradient(180deg, rgba(183, 183, 183, 0.24), rgba(110, 110, 110, 0.15));
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  border-radius: 1.4rem;
  overflow: hidden;
}

.quote-card,
.clock-card,
.welcome-card,
.nav-card,
.footer-card {
  position: relative;
}

.quote-card {
  grid-area: quote;
  min-height: 16.6rem;
  padding: 1.7rem 1.9rem;
  display: grid;
  place-items: center;
  text-align: center;
}

.quote-card h2,
.clock-card h2,
.section-title {
  margin: 0;
  font-size: 1.18rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.quote-card p {
  margin: 0.75rem 0 0.45rem;
  font-size: clamp(1.15rem, 1.8vw, 1.6rem);
  line-height: 1.7;
}

.quote-card strong {
  margin-left: auto;
  color: rgba(255, 255, 255, 0.62);
  font-size: 1rem;
  font-weight: 500;
}

.clock-card {
  grid-area: clock;
  min-height: 16.6rem;
  padding: 1.7rem 1.9rem;
  display: grid;
  place-items: center;
  text-align: center;
}

.clock-date {
  margin-top: 0.9rem;
  font-size: 1.18rem;
  color: rgba(255, 255, 255, 0.7);
}

.clock-time {
  font-size: clamp(2rem, 4.5vw, 3.1rem);
  line-height: 1.05;
  font-weight: 300;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1.95fr;
  grid-template-areas: "welcome nav";
  gap: 1.2rem;
  align-items: stretch;
}

.welcome-card {
  grid-area: welcome;
  min-height: 5.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 1.5rem;
  text-align: center;
  font-size: clamp(1.1rem, 1.6vw, 1.45rem);
}

.nav-card {
  grid-area: nav;
  padding: 0.85rem 1rem 1rem;
}

.section-title {
  padding-left: 0.15rem;
}

.nav-links {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
  margin-top: 0.65rem;
}

.nav-links a {
  min-height: 4.4rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.02);
  display: grid;
  place-items: center;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 700;
  letter-spacing: 0.08em;
  transition: transform 0.22s ease, background 0.22s ease, border-color 0.22s ease;
}

.nav-links a:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.22);
}

.nav-dots {
  display: flex;
  gap: 0.85rem;
  padding: 1rem 0 0.1rem;
}

.nav-dots span {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
}

.footer-card {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
  min-height: 4.6rem;
  padding: 1rem 1.25rem;
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.92rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.22rem 0.55rem;
  border-radius: 0.4rem;
  color: rgba(255, 255, 255, 0.95);
}

.badge-red { background: #f06767; }
.badge-orange { background: #f08f38; }
.badge-pink { background: #df3b7c; }

.stats-launch {
  position: fixed;
  left: 1rem;
  bottom: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  color: white;
  border-radius: 0.8rem;
  display: grid;
  place-items: center;
  cursor: pointer;
  opacity: 0.35;
}

.stats-overlay {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background: rgba(10, 10, 14, 0.84);
}

.stats-panel {
  width: min(100%, 32rem);
  padding: 1.6rem;
  border-radius: 1.3rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.36);
}

.stats-panel h3 {
  margin: 0;
  font-size: 1.15rem;
  letter-spacing: 0.14em;
}

.stats-list {
  margin-top: 1rem;
  display: grid;
  gap: 0.7rem;
  color: rgba(255, 255, 255, 0.82);
}

.stats-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stats-empty {
  text-align: center;
  color: rgba(255, 255, 255, 0.55);
  padding: 1rem 0;
}

.stats-close {
  margin-top: 1.2rem;
  width: 100%;
  padding: 0.85rem 1rem;
  border: 0;
  border-radius: 0.85rem;
  color: white;
  background: rgba(255, 255, 255, 0.14);
  cursor: pointer;
}

.go-layout,
.notfound-layout {
  min-height: 100vh;
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  padding: 2rem;
  text-align: center;
}

.go-orbit,
.notfound-grid {
  position: relative;
  width: min(100%, 32rem);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
}

.go-ring,
.go-ring-alt,
.notfound-orbit {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(0, 242, 255, 0.16);
}

.go-ring {
  opacity: 0;
  transform: scale(0.84);
  border-top: 2px solid #00f2ff;
  border-right-color: rgba(0, 242, 255, 0.12);
}

.go-ring-alt {
  inset: 10%;
  border-bottom: 2px solid #ff58cc;
  border-left-color: rgba(255, 88, 204, 0.12);
}

.go-core {
  display: grid;
  gap: 0.35rem;
}

.go-percent {
  font-size: clamp(4rem, 13vw, 6rem);
  font-weight: 800;
}

.go-label {
  font-size: 0.75rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #00f2ff;
}

.go-title {
  margin: 1.2rem 0 0.7rem;
  font-size: 1.2rem;
  letter-spacing: 0.5rem;
  text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff;
}

.go-logs {
  color: rgba(255, 255, 255, 0.42);
  font-family: "Courier New", monospace;
  font-size: 0.82rem;
  text-align: left;
  min-width: 18rem;
}

.go-logs p {
  margin: 0.25rem 0;
}

.notfound-grid {
  aspect-ratio: auto;
  min-height: 42rem;
}

.notfound-orbit {
  inset: 8%;
  opacity: 0.28;
  box-shadow: 0 0 70px rgba(255, 0, 255, 0.12), 0 0 70px rgba(0, 242, 255, 0.12);
}

.notfound-panel {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 0.8rem;
  justify-items: center;
}

.notfound-title {
  margin: 0;
  font-size: clamp(6rem, 18vw, 15rem);
  font-weight: 900;
  opacity: 0;
  transform: scale(0.5);
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.notfound-copy {
  margin: 0;
  max-width: 36rem;
  color: rgba(255, 255, 255, 0.6);
  opacity: 0;
  transform: translateY(20px);
  line-height: 1.8;
}

.notfound-btn {
  opacity: 0;
  transform: translateY(16px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 11rem;
  padding: 0.9rem 1.6rem;
  border-radius: 0.8rem;
  border: 1px solid #ff00ff;
  color: #ff00ff;
  text-decoration: none;
}

@media (max-width: 1100px) {
  .home-layout {
    overflow-y: auto;
  }

  .hero-grid,
  .info-grid {
    grid-template-columns: 1fr;
    grid-template-areas: none;
  }

  .hero-art {
    min-height: 22rem;
  }

  .avatar-shell {
    width: min(56vw, 17rem);
  }

  .nav-links {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-art,
  .quote-card,
  .clock-card,
  .welcome-card,
  .nav-card {
    grid-area: auto;
  }
}

@media (max-width: 640px) {
  .home-layout {
    padding: 1rem;
    gap: 1rem;
  }

  .home-topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }

  .hero-art {
    min-height: 18rem;
  }

  .record-left {
    width: 14rem;
    height: 14rem;
  }

  .record-right {
    width: 15rem;
    height: 15rem;
  }

  .books {
    width: 12rem;
  }

  .quote-card,
  .clock-card {
    min-height: 11rem;
    padding: 1.25rem;
  }

  .welcome-card {
    min-height: 4.6rem;
  }

  .nav-links {
    grid-template-columns: 1fr 1fr;
  }

  .footer-card {
    font-size: 0.8rem;
  }
}
</style>
