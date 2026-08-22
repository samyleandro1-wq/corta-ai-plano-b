'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  Scissors, Sparkles, Zap, Youtube, Download, Trash2, LogOut, Crown, Shield,
  Play, Pause, Check, Rocket, TrendingUp, Video, Palette, ArrowRight, Lock,
  Star, Users, DollarSign, Edit3, ShieldCheck
} from 'lucide-react'

const OWNER_EMAIL = 'samyleandro1@gmail.com'
const PAY_LINK = 'https://payment-link-v3.stone.com.br/pl_JZqWpY3oz7PaYgmf86hxb9w6LeyBKRGA'
const PRICE = 'R$9,90'

// -------------- localStorage helpers --------------
const LS = {
  users: 'cortaai_users',
  session: 'cortaai_session',
  clips: 'cortaai_clips', // { [email]: Clip[] }
}
const readLS = (k, fb) => {
  if (typeof window === 'undefined') return fb
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb } catch { return fb }
}
const writeLS = (k, v) => { if (typeof window !== 'undefined') localStorage.setItem(k, JSON.stringify(v)) }

// -------------- Mock IA --------------
const mockPhrases = [
  'Isso vai mudar sua vida pra sempre',
  'Ninguém te contou isso antes',
  'O segredo que a mídia esconde',
  'Prepara porque vem bomba',
  'Você não vai acreditar no final',
  'Essa é a verdade nua e crua',
  'Espera até você ver isso',
  'O que aconteceu depois foi surreal',
]
const genFakeClips = (url) => {
  const n = 3 + Math.floor(Math.random() * 3) // 3-5 cortes
  const arr = []
  for (let i = 0; i < n; i++) {
    arr.push({
      id: crypto.randomUUID(),
      title: `Corte Viral #${i + 1}`,
      caption: mockPhrases[Math.floor(Math.random() * mockPhrases.length)],
      duration: 30 + Math.floor(Math.random() * 30),
      score: 82 + Math.floor(Math.random() * 18),
      thumbnailHue: Math.floor(Math.random() * 360),
      sourceUrl: url,
      createdAt: new Date().toISOString(),
    })
  }
  return arr
}

// -------------- App --------------
export default function App() {
  const [route, setRoute] = useState('landing') // landing | login | register | dashboard | admin
  const [session, setSession] = useState(null)
  const [users, setUsers] = useState([])
  const [clipsByUser, setClipsByUser] = useState({})

  useEffect(() => {
    const s = readLS(LS.session, null)
    const u = readLS(LS.users, [])
    const c = readLS(LS.clips, {})
    setUsers(u)
    setClipsByUser(c)
    if (s) {
      setSession(s)
      setRoute('dashboard')
    }
  }, [])

  const persistUsers = (u) => { setUsers(u); writeLS(LS.users, u) }
  const persistClips = (c) => { setClipsByUser(c); writeLS(LS.clips, c) }
  const persistSession = (s) => { setSession(s); writeLS(LS.session, s) }

  const logout = () => {
    setSession(null)
    localStorage.removeItem(LS.session)
    setRoute('landing')
    toast.success('Você saiu da conta')
  }

  const markPaid = (email) => {
    const nu = users.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, paid: true } : u)
    persistUsers(nu)
    toast.success('Assinatura ativada! Cortes ilimitados liberados 🚀')
  }

  // Detect return from payment via ?paid=1
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('paid') === '1' && session?.email) {
      markPaid(session.email)
      window.history.replaceState({}, '', window.location.pathname)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const doLogin = (email, password) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!found) { toast.error('Usuário não encontrado. Crie uma conta.'); return false }
    if (found.password !== password) { toast.error('Senha incorreta.'); return false }
    persistSession({ email: found.email })
    setRoute('dashboard')
    toast.success(`Bem-vindo de volta, ${found.email}!`)
    return true
  }

  const doRegister = (email, password) => {
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error('Email já cadastrado.'); return false
    }
    const newUser = {
      email, password,
      paid: email.toLowerCase() === OWNER_EMAIL.toLowerCase(),
      createdAt: new Date().toISOString(),
    }
    const nu = [...users, newUser]
    persistUsers(nu)
    persistSession({ email })
    setRoute('dashboard')
    toast.success('Conta criada! Você tem 1 corte grátis 🎉')
    return true
  }

  const currentUser = session ? users.find(u => u.email.toLowerCase() === session.email.toLowerCase()) : null
  const isOwner = currentUser?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()
  const isPaid = !!currentUser?.paid
  const myClips = currentUser ? (clipsByUser[currentUser.email] || []) : []

  // -------------- Views --------------
  if (route === 'landing') return <Landing onGo={setRoute} />
  if (route === 'login') return <AuthPage mode="login" onGo={setRoute} onSubmit={doLogin} />
  if (route === 'register') return <AuthPage mode="register" onGo={setRoute} onSubmit={doRegister} />
  if (route === 'admin' && isOwner) return (
    <Admin
      users={users}
      clipsByUser={clipsByUser}
      onBack={() => setRoute('dashboard')}
      onLogout={logout}
      onTogglePaid={(email) => {
        const nu = users.map(u => u.email === email ? { ...u, paid: !u.paid } : u)
        persistUsers(nu)
        toast.success('Status de assinatura atualizado')
      }}
    />
  )
  if (route === 'dashboard' && currentUser) return (
    <Dashboard
      user={currentUser}
      isOwner={isOwner}
      isPaid={isPaid}
      clips={myClips}
      onLogout={logout}
      onGoAdmin={() => setRoute('admin')}
      onConfirmPaid={() => markPaid(currentUser.email)}
      onGenerate={(url, style) => {
        const already = myClips.length
        if (!isOwner && !isPaid && already >= 1) {
          toast.error('Limite grátis atingido. Assine para cortes ilimitados.')
          return null
        }
        const clips = genFakeClips(url).map(c => ({ ...c, style }))
        const bundle = {
          id: crypto.randomUUID(),
          name: `Vídeo ${already + 1}`,
          url,
          style,
          clips,
          createdAt: new Date().toISOString(),
        }
        const next = { ...clipsByUser, [currentUser.email]: [bundle, ...myClips] }
        persistClips(next)
        toast.success(`${clips.length} cortes gerados com IA! 🎬`)
        return bundle
      }}
      onRenameBundle={(bid, name) => {
        const list = (clipsByUser[currentUser.email] || []).map(b => b.id === bid ? { ...b, name } : b)
        persistClips({ ...clipsByUser, [currentUser.email]: list })
      }}
      onDeleteBundle={(bid) => {
        const list = (clipsByUser[currentUser.email] || []).filter(b => b.id !== bid)
        persistClips({ ...clipsByUser, [currentUser.email]: list })
        toast.success('Corte apagado')
      }}
    />
  )

  // fallback
  return <Landing onGo={setRoute} />
}

// ==================== LANDING ====================
function Landing({ onGo }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden relative">
      {/* background glow */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -right-40 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* nav */}
      <nav className="relative z-10 border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg grad-bg flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Corta<span className="grad-text">AI</span></span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => onGo('login')} className="text-white/80 hover:text-white">Entrar</Button>
            <Button onClick={() => onGo('register')} className="grad-bg hover:opacity-90">Criar Conta</Button>
          </div>
        </div>
      </nav>

      {/* hero */}
      <section className="relative z-10 container mx-auto px-4 pt-20 pb-24 max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <Badge className="mb-6 bg-purple-500/10 text-purple-300 border-purple-500/20 hover:bg-purple-500/20">
            <Sparkles className="w-3 h-3 mr-1" /> IA de última geração
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] max-w-4xl">
            Transforme vídeos longos em <span className="grad-text">cortes virais</span> em 1 clique
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl">
            CortaAI usa IA para achar os melhores momentos e legendar automaticamente. Cole o link do YouTube e receba cortes prontos pra postar.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => onGo('login')} className="grad-bg hover:opacity-90 h-14 px-8 text-base glow">
              <Zap className="w-5 h-5 mr-2" /> Testar Grátis 1 Corte
            </Button>
            <Button size="lg" variant="outline" asChild className="h-14 px-8 text-base border-white/20 bg-white/5 hover:bg-white/10">
              <a href={PAY_LINK} target="_blank" rel="noreferrer">
                <Crown className="w-5 h-5 mr-2 text-yellow-400" /> Assinar Agora {PRICE}
              </a>
            </Button>
          </div>
          <div className="mt-6 flex items-center gap-6 text-sm text-white/50">
            <div className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-400" /> Sem cartão</div>
            <div className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-400" /> Cancele quando quiser</div>
            <div className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-400" /> Legendas automáticas</div>
          </div>

          {/* fake preview */}
          <div className="mt-16 w-full max-w-4xl">
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4 backdrop-blur">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0,1,2].map(i => (
                  <FakePhone key={i} idx={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="relative z-10 container mx-auto px-4 py-24 max-w-6xl">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">Feito pra <span className="grad-text">creators sérios</span></h2>
        <p className="text-center text-white/60 max-w-2xl mx-auto mb-16">Automatize sua produção de conteúdo. Poste 10x mais em 10x menos tempo.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: 'IA identifica os melhores momentos', desc: 'Nossa IA analisa o vídeo e escolhe os trechos com maior potencial viral.' },
            { icon: Edit3, title: 'Legendas automáticas estilizadas', desc: 'Cor, posição e estilo personalizáveis. Palavras destacadas no ritmo certo.' },
            { icon: Rocket, title: 'Pronto pra postar em segundos', desc: 'Formato 9:16 vertical, otimizado pra Reels, TikTok e Shorts.' },
          ].map((f, i) => (
            <Card key={i} className="bg-white/5 border-white/10 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg grad-bg flex items-center justify-center mb-3">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">{f.title}</CardTitle>
                <CardDescription className="text-white/60">{f.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* pricing */}
      <section className="relative z-10 container mx-auto px-4 py-24 max-w-6xl">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">Preço <span className="grad-text">absurdo</span> de bom</h2>
        <p className="text-center text-white/60 mb-16">Menos que um lanche por mês.</p>

        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-to-b from-purple-600/20 to-transparent border-purple-500/40 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl" />
            <CardHeader className="relative">
              <Badge className="w-fit bg-purple-500/20 border-purple-500/40 text-purple-200">MAIS POPULAR</Badge>
              <CardTitle className="text-3xl mt-3 text-white">Pro Ilimitado</CardTitle>
              <CardDescription className="text-white/60">Cortes ilimitados, legendas premium, sem marca d'água</CardDescription>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">{PRICE}</span>
                <span className="text-white/60">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-3">
              {['Cortes ilimitados por mês','Legendas automáticas em pt-BR','Editor de estilo de legenda','Suporte prioritário','Sem marca d\'água'].map(x => (
                <div key={x} className="flex items-center gap-2 text-white/85">
                  <div className="w-5 h-5 rounded-full grad-bg flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                  {x}
                </div>
              ))}
              <Button size="lg" asChild className="w-full mt-4 grad-bg hover:opacity-90 h-12 text-base glow">
                <a href={PAY_LINK} target="_blank" rel="noreferrer">Assinar Agora <ArrowRight className="w-4 h-4 ml-2" /></a>
              </Button>
              <Button size="lg" variant="ghost" onClick={() => onGo('login')} className="w-full text-white/70 hover:text-white">
                Ou testar 1 corte grátis
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-white/40 text-sm">
        © {new Date().getFullYear()} CortaAI. Todos os direitos reservados.
      </footer>
    </div>
  )
}

function FakePhone({ idx }) {
  const captions = ['ESSE segredo mudou tudo','ninguém falava disso','você vai QUERER ver']
  const colors = ['bg-yellow-300 text-black','bg-white text-black','bg-purple-500 text-white']
  return (
    <div className="relative aspect-[9/16] rounded-xl overflow-hidden border border-white/10"
         style={{ background: `linear-gradient(160deg, hsl(${idx*90},70%,25%), hsl(${idx*90+40},70%,10%))` }}>
      <div className="absolute inset-0 flex items-end p-3">
        <div className={`px-3 py-1.5 rounded-md font-black text-sm ${colors[idx]}`}>
          {captions[idx]}
        </div>
      </div>
      <div className="absolute top-3 left-3 flex items-center gap-1 text-white/70 text-xs">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> AO VIVO
      </div>
      <div className="absolute top-3 right-3 bg-black/50 px-2 py-0.5 rounded text-xs text-white">0:{28+idx*4}</div>
    </div>
  )
}

// ==================== AUTH ====================
function AuthPage({ mode, onGo, onSubmit }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (!email || !password) return toast.error('Preencha email e senha')
    onSubmit(email.trim(), password)
  }
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl" />
      <Card className="w-full max-w-md relative bg-white/5 border-white/10 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl grad-bg flex items-center justify-center mb-2">
            <Scissors className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl text-white">
            {mode === 'login' ? 'Entrar no CortaAI' : 'Criar conta grátis'}
          </CardTitle>
          <CardDescription className="text-white/60">
            {mode === 'login' ? 'Bem-vindo de volta' : 'Ganhe 1 corte grátis pra testar'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                     placeholder="voce@email.com"
                     className="bg-black/40 border-white/10 text-white h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">Senha</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                     placeholder="••••••••"
                     className="bg-black/40 border-white/10 text-white h-11" />
            </div>
            <Button type="submit" className="w-full grad-bg hover:opacity-90 h-11">
              {mode === 'login' ? 'Entrar' : 'Criar conta grátis'}
            </Button>
          </form>
          <Separator className="my-6 bg-white/10" />
          <div className="text-center text-sm text-white/60">
            {mode === 'login' ? (
              <>Não tem conta? <button onClick={() => onGo('register')} className="text-purple-400 hover:underline">Criar agora</button></>
            ) : (
              <>Já tem conta? <button onClick={() => onGo('login')} className="text-purple-400 hover:underline">Entrar</button></>
            )}
          </div>
          <div className="text-center mt-4">
            <button onClick={() => onGo('landing')} className="text-xs text-white/40 hover:text-white/70">← Voltar pra home</button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== DASHBOARD ====================
function Dashboard({ user, isOwner, isPaid, clips, onLogout, onGenerate, onRenameBundle, onDeleteBundle, onGoAdmin, onConfirmPaid }) {
  const [url, setUrl] = useState('')
  const [styleOpen, setStyleOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [style, setStyle] = useState({ color: 'yellow', position: 'bottom' })
  const [playingId, setPlayingId] = useState(null)
  const [payClicked, setPayClicked] = useState(false)

  const totalClips = clips.length
  const locked = !isOwner && !isPaid && totalClips >= 1

  const openGenerate = () => {
    if (!url.trim()) { toast.error('Cole um link do YouTube'); return }
    if (locked) { toast.error('Assine para gerar mais cortes'); return }
    setStyleOpen(true)
  }

  const runGenerate = async () => {
    setStyleOpen(false)
    setPending(true)
    // fake IA delay
    await new Promise(r => setTimeout(r, 2200))
    const bundle = onGenerate(url.trim(), style)
    setPending(false)
    if (bundle) setUrl('')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/5 backdrop-blur bg-[#0A0A0A]/80">
        <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg grad-bg flex items-center justify-center">
              <Scissors className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">Corta<span className="grad-text">AI</span></span>
            {isOwner && <Badge className="ml-2 bg-yellow-500/15 border-yellow-500/40 text-yellow-300"><Crown className="w-3 h-3 mr-1" /> OWNER</Badge>}
            {!isOwner && isPaid && <Badge className="ml-2 bg-emerald-500/15 border-emerald-500/40 text-emerald-300">PRO</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-sm text-white/60">{user.email}</span>
            {isOwner && (
              <Button variant="outline" size="sm" onClick={onGoAdmin} className="border-white/10 bg-white/5 hover:bg-white/10">
                <Shield className="w-4 h-4 mr-1" /> Admin
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onLogout} className="border-white/10 bg-white/5 hover:bg-white/10">
              <LogOut className="w-4 h-4 mr-1" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Card 1: Generate */}
        <Card className="bg-gradient-to-br from-purple-600/10 via-white/5 to-pink-600/10 border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <CardTitle className="text-white">Gerar Novos Cortes</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              Cole o link de um vídeo do YouTube. Nossa IA vai identificar os melhores momentos e legendar automaticamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                <Input
                  value={url} onChange={e => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="pl-11 h-12 bg-black/40 border-white/10 text-white"
                  disabled={pending}
                />
              </div>
              <Button
                onClick={openGenerate}
                disabled={pending || locked}
                className="h-12 px-6 grad-bg hover:opacity-90 disabled:opacity-50"
              >
                {pending ? (
                  <><Sparkles className="w-4 h-4 mr-2 animate-spin" /> Analisando com IA...</>
                ) : locked ? (
                  <><Lock className="w-4 h-4 mr-2" /> Bloqueado</>
                ) : (
                  <><Zap className="w-4 h-4 mr-2" /> Gerar Corte com IA</>
                )}
              </Button>
            </div>

            {locked && (
              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <Crown className="w-5 h-5 text-yellow-300" />
                    </div>
                    <div>
                      <div className="font-semibold text-yellow-100">Assine {PRICE} para liberar cortes ilimitados</div>
                      <div className="text-xs text-yellow-200/70">Você já usou seu corte grátis. Desbloqueie agora.</div>
                    </div>
                  </div>
                  <Button asChild onClick={() => setPayClicked(true)} className="grad-bg hover:opacity-90">
                    <a href={PAY_LINK} target="_blank" rel="noreferrer">Assinar {PRICE} <ArrowRight className="w-4 h-4 ml-1" /></a>
                  </Button>
                </div>
                {payClicked && (
                  <div className="flex items-center justify-between gap-3 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 flex-wrap">
                    <div className="text-sm text-emerald-100">
                      Já finalizou o pagamento? Clique para liberar seu acesso ilimitado.
                    </div>
                    <Button size="sm" onClick={onConfirmPaid} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                      <Check className="w-4 h-4 mr-1" /> Já paguei, liberar acesso
                    </Button>
                  </div>
                )}
              </div>
            )}

            {pending && <ProgressFake />}
          </CardContent>
        </Card>

        {/* Card 2: History */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-400" />
              <CardTitle className="text-white">Histórico de Cortes</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              {clips.length === 0 ? 'Nenhum corte gerado ainda' : `${clips.length} vídeo(s) processado(s)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clips.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                <Video className="w-12 h-12 mx-auto mb-3 opacity-40" />
                Gere seu primeiro corte pra ver aqui
              </div>
            ) : (
              <div className="space-y-6">
                {clips.map(b => (
                  <BundleItem
                    key={b.id}
                    bundle={b}
                    playingId={playingId}
                    setPlayingId={setPlayingId}
                    onRename={(name) => onRenameBundle(b.id, name)}
                    onDelete={() => onDeleteBundle(b.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Style Modal */}
      <Dialog open={styleOpen} onOpenChange={setStyleOpen}>
        <DialogContent className="bg-[#0F0F0F] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Palette className="w-5 h-5 text-purple-400" /> Estilo das Legendas</DialogTitle>
            <DialogDescription className="text-white/60">Personalize antes de gerar</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-2">
            <div>
              <Label className="text-white/80 mb-3 block">Cor do texto</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'yellow', label: 'Amarelo', cls: 'bg-yellow-400 text-black' },
                  { key: 'white', label: 'Branco', cls: 'bg-white text-black' },
                  { key: 'purple', label: 'Roxo', cls: 'bg-purple-500 text-white' },
                ].map(c => (
                  <button key={c.key} onClick={() => setStyle(s => ({ ...s, color: c.key }))}
                          className={`rounded-lg p-3 border transition ${style.color === c.key ? 'border-purple-500 ring-2 ring-purple-500/40' : 'border-white/10 hover:border-white/30'}`}>
                    <div className={`text-xs font-black px-2 py-1 rounded ${c.cls}`}>Aa</div>
                    <div className="text-xs text-white/70 mt-2">{c.label}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-white/80 mb-3 block">Posição</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'top', label: 'Cima', align: 'items-start' },
                  { key: 'middle', label: 'Meio', align: 'items-center' },
                  { key: 'bottom', label: 'Embaixo', align: 'items-end' },
                ].map(p => (
                  <button key={p.key} onClick={() => setStyle(s => ({ ...s, position: p.key }))}
                          className={`rounded-lg p-3 border transition ${style.position === p.key ? 'border-purple-500 ring-2 ring-purple-500/40' : 'border-white/10 hover:border-white/30'}`}>
                    <div className={`aspect-[3/4] bg-black/60 rounded flex ${p.align} justify-center p-1`}>
                      <div className="h-1.5 w-8 bg-yellow-300 rounded" />
                    </div>
                    <div className="text-xs text-white/70 mt-2">{p.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setStyleOpen(false)} className="text-white/70">Cancelar</Button>
            <Button onClick={runGenerate} className="grad-bg hover:opacity-90">
              <Zap className="w-4 h-4 mr-1" /> Gerar agora
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ProgressFake() {
  const steps = ['Baixando vídeo do YouTube...', 'Transcrevendo áudio...', 'Analisando momentos virais...', 'Gerando legendas...', 'Renderizando cortes...']
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI(x => Math.min(x + 1, steps.length - 1)), 450)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4 space-y-2">
      {steps.map((s, idx) => (
        <div key={s} className="flex items-center gap-2 text-sm">
          {idx < i ? <Check className="w-4 h-4 text-emerald-400" /> :
            idx === i ? <div className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" /> :
            <div className="w-4 h-4 rounded-full border border-white/20" />}
          <span className={idx <= i ? 'text-white' : 'text-white/40'}>{s}</span>
        </div>
      ))}
    </div>
  )
}

function BundleItem({ bundle, playingId, setPlayingId, onRename, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(bundle.name)

  const download = (clip) => {
    const content = `CortaAI - Legenda do Corte\n===\nTítulo: ${clip.title}\nLegenda: ${clip.caption}\nDuração: ${clip.duration}s\nScore Viral: ${clip.score}%\nFonte: ${clip.sourceUrl}\nEstilo: cor=${clip.style?.color}, posição=${clip.style?.position}\n`
    const blob = new Blob([content], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${bundle.name.replace(/\s+/g,'_')}_${clip.title.replace(/\s+/g,'_')}.txt`
    a.click()
    toast.success('Corte baixado (modo simulado)')
  }

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {editing ? (
            <Input
              value={name} onChange={e => setName(e.target.value)}
              onBlur={() => { setEditing(false); if (name.trim()) onRename(name.trim()) }}
              onKeyDown={e => { if (e.key === 'Enter') { setEditing(false); if (name.trim()) onRename(name.trim()) } }}
              autoFocus
              className="bg-black/40 border-white/10 text-white h-9 max-w-xs"
            />
          ) : (
            <button onClick={() => setEditing(true)} className="text-lg font-semibold text-white hover:text-purple-300 flex items-center gap-2 truncate">
              {bundle.name} <Edit3 className="w-3.5 h-3.5 opacity-50" />
            </button>
          )}
          <Badge variant="outline" className="border-white/10 text-white/60">{bundle.clips.length} cortes</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <Trash2 className="w-4 h-4 mr-1" /> Apagar
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bundle.clips.map(c => (
          <ClipPlayer
            key={c.id}
            clip={c}
            playing={playingId === c.id}
            onToggle={() => setPlayingId(playingId === c.id ? null : c.id)}
            onDownload={() => download(c)}
          />
        ))}
      </div>
    </div>
  )
}

function ClipPlayer({ clip, playing, onToggle, onDownload }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!playing) { setProgress(0); return }
    const t = setInterval(() => setProgress(p => (p + 1) % 100), 50)
    return () => clearInterval(t)
  }, [playing])

  const posClass = clip.style?.position === 'top' ? 'items-start pt-4'
    : clip.style?.position === 'middle' ? 'items-center' : 'items-end pb-6'
  const colorClass = clip.style?.color === 'yellow' ? 'bg-yellow-300 text-black'
    : clip.style?.color === 'white' ? 'bg-white text-black'
    : 'bg-purple-500 text-white'

  return (
    <div className="space-y-2">
      <div className="relative aspect-[9/16] rounded-lg overflow-hidden border border-white/10 cursor-pointer group"
           style={{ background: `linear-gradient(160deg, hsl(${clip.thumbnailHue},70%,25%), hsl(${(clip.thumbnailHue+60)%360},70%,10%))` }}
           onClick={onToggle}>
        <div className={`absolute inset-0 flex justify-center px-3 ${posClass}`}>
          <div className={`px-3 py-1.5 rounded-md font-black text-sm text-center leading-tight ${colorClass} shadow-lg max-w-[90%]`}>
            {clip.caption}
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold">
          <TrendingUp className="w-3 h-3 inline mr-0.5 text-emerald-400" /> {clip.score}%
        </div>
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[10px]">
          0:{String(clip.duration).padStart(2,'0')}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/30">
          {playing ? <Pause className="w-10 h-10 text-white" /> : <Play className="w-10 h-10 text-white" />}
        </div>
        {playing && (
          <div className="absolute bottom-0 left-0 h-1 bg-purple-500" style={{ width: `${progress}%` }} />
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-white/70 truncate">{clip.title}</div>
        <Button size="sm" variant="ghost" onClick={onDownload} className="h-7 text-purple-300 hover:text-purple-200 hover:bg-purple-500/10">
          <Download className="w-3.5 h-3.5 mr-1" /> Baixar
        </Button>
      </div>
    </div>
  )
}

// ==================== ADMIN ====================
function Admin({ users, clipsByUser, onBack, onLogout, onTogglePaid }) {
  const totalUsers = users.length
  const totalPaid = users.filter(u => u.paid).length
  const totalClips = Object.values(clipsByUser).reduce((s, arr) => s + arr.reduce((ss, b) => ss + (b.clips?.length || 0), 0), 0)

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="sticky top-0 z-30 border-b border-white/5 backdrop-blur bg-[#0A0A0A]/80">
        <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg grad-bg flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">Painel Admin</span>
            <Badge className="ml-2 bg-yellow-500/15 border-yellow-500/40 text-yellow-300"><Crown className="w-3 h-3 mr-1" /> OWNER</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onBack} className="border-white/10 bg-white/5">← Dashboard</Button>
            <Button variant="outline" size="sm" onClick={onLogout} className="border-white/10 bg-white/5"><LogOut className="w-4 h-4 mr-1" /> Sair</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon={Users} label="Total de usuários" value={totalUsers} color="text-purple-400" />
          <StatCard icon={DollarSign} label="Assinantes pagantes" value={totalPaid} color="text-emerald-400" />
          <StatCard icon={Scissors} label="Cortes gerados" value={totalClips} color="text-pink-400" />
        </div>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Usuários</CardTitle>
            <CardDescription className="text-white/60">Gerencie assinaturas manualmente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/60 text-left">
                    <th className="py-3 pr-4">Email</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Cortes</th>
                    <th className="py-3 pr-4">Cadastro</th>
                    <th className="py-3">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 && (
                    <tr><td colSpan={5} className="py-6 text-center text-white/40">Nenhum usuário ainda</td></tr>
                  )}
                  {users.map(u => {
                    const cnt = (clipsByUser[u.email] || []).reduce((s, b) => s + (b.clips?.length || 0), 0)
                    const isOwner = u.email.toLowerCase() === OWNER_EMAIL.toLowerCase()
                    return (
                      <tr key={u.email} className="border-b border-white/5">
                        <td className="py-3 pr-4 font-medium">
                          {u.email}
                          {isOwner && <Badge className="ml-2 bg-yellow-500/15 border-yellow-500/40 text-yellow-300">OWNER</Badge>}
                        </td>
                        <td className="py-3 pr-4">
                          {u.paid
                            ? <Badge className="bg-emerald-500/15 border-emerald-500/40 text-emerald-300">Pago</Badge>
                            : <Badge className="bg-white/5 border-white/20 text-white/60">Grátis</Badge>}
                        </td>
                        <td className="py-3 pr-4">{cnt}</td>
                        <td className="py-3 pr-4 text-white/60">{new Date(u.createdAt).toLocaleDateString('pt-BR')}</td>
                        <td className="py-3">
                          <Button size="sm" variant="outline" disabled={isOwner}
                                  onClick={() => onTogglePaid(u.email)}
                                  className="border-white/10 bg-white/5 hover:bg-white/10">
                            {u.paid ? 'Revogar' : 'Liberar Assinatura'}
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <div className="text-2xl font-black">{value}</div>
          <div className="text-xs text-white/60">{label}</div>
        </div>
      </CardContent>
    </Card>
  )
}
