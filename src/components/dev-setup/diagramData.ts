export type Lang = 'de' | 'en'

export type FlowId = 'agent' | 'human' | 'phone' | 'deploy'

export type Zone = 'me' | 'server' | 'outside'

type Text = Record<Lang, string>

export type DiagramNode = {
  id: string
  x: number
  y: number
  zone: Zone
  label: Text
  sub?: Text
  info: Text
  page?: string
}

export type DiagramEdge = {
  source: string
  target: string
  flows: FlowId[]
  label?: Text
  dashed?: boolean
}

export const flows: { id: FlowId; color: string; label: Text; info: Text }[] = [
  {
    id: 'agent',
    color: 'var(--color-info)',
    label: { de: 'Agenten-Kanal', en: 'Agent channel' },
    info: {
      de: 'Der Agent holt sich am Socket seiner Drohne einen Token, der eine Stunde gilt und nur für die freigegebenen Repos taugt. Damit pusht er zu GitHub. Kein Mensch nötig.',
      en: 'The agent asks its drone’s socket for a token that lives one hour and only works for the drone’s repos, then pushes to GitHub with it. No human needed.',
    },
  },
  {
    id: 'human',
    color: 'var(--color-warning)',
    label: { de: 'Mensch-Kanal', en: 'Human channel' },
    info: {
      de: 'Ich melde mich per SSH über das Tailnet an. Mein Schlüssel liegt im Secure Enclave, jede Benutzung braucht meinen Fingerabdruck – auch wenn ein Agent ihn über ssh -A benutzen will.',
      en: 'I log in via SSH over the tailnet. My key lives in the Secure Enclave and every use needs my fingerprint – including when an agent wants to use it through ssh -A.',
    },
  },
  {
    id: 'phone',
    color: 'var(--color-accent)',
    label: { de: 'Handy', en: 'Phone' },
    info: {
      de: 'Unterwegs kein SSH: Ich schalte in einer Claude-Code-Sitzung die Remote Control ein und führe sie in der Claude-App weiter.',
      en: 'No SSH on the go: I enable Remote Control in a Claude Code session and continue it in the Claude app.',
    },
  },
  {
    id: 'deploy',
    color: 'var(--color-success)',
    label: { de: 'Deploy (Teil 2)', en: 'Deploy (part 2)' },
    info: {
      de: 'Ab GitHub übernimmt die CI, Argo CD rollt in den Cluster aus. Agenten brauchen dafür keinen Zugang zum Cluster.',
      en: 'From GitHub on, CI takes over and Argo CD rolls out to the cluster. Agents need no cluster access for that.',
    },
  },
]

export const zones: {
  id: Zone
  x: number
  y: number
  w: number
  h: number
  label: Text
}[] = [
  {
    id: 'me',
    x: 10,
    y: 30,
    w: 190,
    h: 500,
    label: { de: 'Bei mir', en: 'With me' },
  },
  {
    id: 'server',
    x: 300,
    y: 30,
    w: 360,
    h: 500,
    label: { de: 'Dev-Server (Bare Metal)', en: 'Dev server (bare metal)' },
  },
  {
    id: 'outside',
    x: 720,
    y: 30,
    w: 170,
    h: 500,
    label: { de: 'Draußen', en: 'Outside' },
  },
]

const page = (slug: string) => `/docs/dev-setup/${slug}`

export const nodes: DiagramNode[] = [
  {
    id: 'laptop',
    x: 105,
    y: 120,
    zone: 'me',
    label: { de: 'Laptop', en: 'Laptop' },
    sub: { de: 'leicht, kein Kraftpaket', en: 'light, not a powerhouse' },
    info: {
      de: 'Nur ein Terminal mit gutem Bildschirm. Gerechnet wird auf dem Server, gesprochen wird per Speech-to-Text.',
      en: 'Just a terminal with a good screen. The server does the work; I talk via speech-to-text.',
    },
    page: page('compute'),
  },
  {
    id: 'secretive',
    x: 105,
    y: 230,
    zone: 'me',
    label: { de: 'SSH-Schlüssel', en: 'SSH key' },
    sub: { de: 'Secure Enclave, Touch ID', en: 'Secure Enclave, Touch ID' },
    info: {
      de: 'Verwaltet mit Secretive. Nicht exportierbar, jede Signatur braucht meinen Finger. Das ist die Leine für alles Heikle.',
      en: 'Managed with Secretive. Cannot be exported, every signature needs my finger. This is the leash for everything sensitive.',
    },
    page: page('identity'),
  },
  {
    id: 'phone',
    x: 105,
    y: 420,
    zone: 'me',
    label: { de: 'Handy', en: 'Phone' },
    sub: { de: 'Claude-App', en: 'Claude app' },
    info: {
      de: 'Kein SSH. Laufende Sitzungen werden per Remote Control aus der Claude-App gesteuert.',
      en: 'No SSH. Running sessions are steered from the Claude app via Remote Control.',
    },
    page: page('workplace'),
  },
  {
    id: 'tailnet',
    x: 250,
    y: 175,
    zone: 'me',
    label: { de: 'Tailnet', en: 'Tailnet' },
    sub: { de: 'Erreichbarkeit', en: 'reachability' },
    info: {
      de: 'Jede Drohne ist ein eigener Rechner mit eigenem Namen. Das Tailnet macht sie erreichbar – für die Sicherheit ist es nicht zuständig.',
      en: 'Every drone is a machine of its own with its own name. The tailnet makes them reachable – it is not the security layer.',
    },
    page: page('network'),
  },
  {
    id: 'hatchery',
    x: 390,
    y: 90,
    zone: 'server',
    label: { de: 'hatchery', en: 'hatchery' },
    sub: { de: 'CLI', en: 'CLI' },
    info: {
      de: 'Spawnt, stoppt und löscht Drohnen aus der devcontainer.json des jeweiligen Repos. Docker ist die einzige Wahrheit.',
      en: 'Spawns, stops and removes drones from each repo’s own devcontainer.json. Docker is the single source of truth.',
    },
    page: page('hatchery'),
  },
  {
    id: 'drone1',
    x: 570,
    y: 160,
    zone: 'server',
    label: { de: 'Drohne', en: 'Drone' },
    sub: { de: 'levino/shipyard', en: 'levino/shipyard' },
    info: {
      de: 'Ein Devcontainer pro Repo. Darin: Claude Code, zellij, mehrere Agenten. Wegwerfbar – Code und Claude-Zustand liegen auf dem Host.',
      en: 'One devcontainer per repo. Inside: Claude Code, zellij, several agents. Disposable – code and Claude state live on the host.',
    },
    page: page('hatchery'),
  },
  {
    id: 'drone2',
    x: 570,
    y: 270,
    zone: 'server',
    label: { de: 'Drohne', en: 'Drone' },
    sub: { de: 'levino/levinkeller.de', en: 'levino/levinkeller.de' },
    info: {
      de: 'Jede Drohne sieht nur ihre eigenen Repos. Ein zweites Repo gebe ich mit hatchery repo connect frei.',
      en: 'Each drone only sees its own repos. I grant a second repo with hatchery repo connect.',
    },
    page: page('hatchery'),
  },
  {
    id: 'drone3',
    x: 570,
    y: 380,
    zone: 'server',
    label: { de: 'Drohne', en: 'Drone' },
    sub: { de: '… mit --kvm', en: '… with --kvm' },
    info: {
      de: 'Auf Wunsch mit /dev/kvm, dann laufen Android-Emulatoren direkt in der Drohne.',
      en: 'Optionally with /dev/kvm, so Android emulators run right inside the drone.',
    },
    page: page('native-apps'),
  },
  {
    id: 'creds',
    x: 400,
    y: 450,
    zone: 'server',
    label: { de: 'Credential-Service', en: 'Credential service' },
    sub: { de: 'ein Socket pro Drohne', en: 'one socket per drone' },
    info: {
      de: 'Kennt den Schlüssel der GitHub-App. Legt jeder Drohne einen Unix-Socket hinein und stellt darüber Ein-Stunden-Tokens aus – nur für die freigegebenen Repos.',
      en: 'Holds the GitHub App key. Mounts a Unix socket into every drone and issues one-hour tokens through it – only for the granted repos.',
    },
    page: page('identity'),
  },
  {
    id: 'claude',
    x: 805,
    y: 120,
    zone: 'outside',
    label: { de: 'Claude', en: 'Claude' },
    sub: { de: 'Remote Control', en: 'Remote Control' },
    info: {
      de: 'Vermittelt zwischen der Claude-App auf dem Handy und der Sitzung in der Drohne.',
      en: 'Relays between the Claude app on the phone and the session in the drone.',
    },
    page: page('workplace'),
  },
  {
    id: 'github',
    x: 805,
    y: 290,
    zone: 'outside',
    label: { de: 'GitHub', en: 'GitHub' },
    sub: { de: 'GitHub-App', en: 'GitHub App' },
    info: {
      de: 'Hier liegt der Code. Die GitHub-App stellt Installation-Tokens aus, die nach einer Stunde ablaufen und auf einzelne Repos beschränkt sind.',
      en: 'The code lives here. The GitHub App issues installation tokens that expire after one hour and are limited to single repos.',
    },
    page: page('identity'),
  },
  {
    id: 'prod',
    x: 805,
    y: 450,
    zone: 'outside',
    label: { de: 'Prod-Cluster', en: 'Prod cluster' },
    sub: { de: 'k3s, Argo CD (Teil 2)', en: 'k3s, Argo CD (part 2)' },
    info: {
      de: 'Der Deploy-Stack. Agenten kommen nicht direkt hin – nur über Git und CI, oder über meinen Schlüssel und damit meinen Finger.',
      en: 'The deploy stack. Agents cannot reach it directly – only via git and CI, or via my key and therefore my finger.',
    },
    page: page('deploy-boundary'),
  },
]

export const edges: DiagramEdge[] = [
  {
    source: 'secretive',
    target: 'laptop',
    flows: ['human'],
    label: { de: 'Touch ID', en: 'Touch ID' },
  },
  { source: 'laptop', target: 'tailnet', flows: ['human'] },
  {
    source: 'tailnet',
    target: 'drone1',
    flows: ['human'],
    label: { de: 'ssh -A', en: 'ssh -A' },
  },
  { source: 'tailnet', target: 'drone2', flows: ['human'] },
  { source: 'tailnet', target: 'drone3', flows: ['human'] },
  {
    source: 'drone3',
    target: 'prod',
    flows: ['human'],
    dashed: true,
    label: { de: 'nur mit Finger', en: 'finger only' },
  },
  { source: 'hatchery', target: 'drone1', flows: [] },
  {
    source: 'creds',
    target: 'drone2',
    flows: ['agent'],
    label: { de: 'Socket', en: 'socket' },
  },
  { source: 'creds', target: 'drone1', flows: ['agent'] },
  { source: 'creds', target: 'drone3', flows: ['agent'] },
  {
    source: 'creds',
    target: 'github',
    flows: ['agent'],
    label: { de: 'App-Schlüssel → Token', en: 'app key → token' },
  },
  {
    source: 'drone2',
    target: 'github',
    flows: ['agent'],
    label: { de: 'git push (1 h Token)', en: 'git push (1 h token)' },
  },
  { source: 'phone', target: 'claude', flows: ['phone'] },
  {
    source: 'claude',
    target: 'drone1',
    flows: ['phone'],
    label: { de: 'Remote Control', en: 'Remote Control' },
  },
  {
    source: 'github',
    target: 'prod',
    flows: ['deploy'],
    label: { de: 'CI → Argo CD', en: 'CI → Argo CD' },
  },
]

export const ui = {
  all: { de: 'Alles', en: 'Everything' },
  hint: {
    de: 'Tipp auf einen Baustein oder einen Kanal.',
    en: 'Tap a building block or a channel.',
  },
  more: { de: 'Mehr dazu', en: 'Read more' },
  ariaLabel: {
    de: 'Schaubild des Dev-Setups: Laptop, Handy und SSH-Schlüssel links, der Dev-Server mit hatchery, Drohnen und Credential-Service in der Mitte, Claude, GitHub und der Produktions-Cluster rechts.',
    en: 'Diagram of the dev setup: laptop, phone and SSH key on the left, the dev server with hatchery, drones and the credential service in the middle, Claude, GitHub and the production cluster on the right.',
  },
}
