# Engine de Jogos

Engine HTML5 própria (sem motor de terceiros no núcleo), pensada para depois
exportar pra APK Android e ser distribuída com recursos por assinatura.

## Rodando

```bash
npm install
npm run dev
```

Abre `index.html` (jogo de demonstração) e `editor.html` (editor de sprites).

## Arquitetura

- **ECS próprio** (`src/core/ecs/World.ts`): entidades são só IDs; componentes
  são dados puros; sistemas leem/escrevem componentes a cada frame. Isso é o
  que permite arcade, puzzle e isométrico conviverem sem se atropelar — cada
  gênero é só um conjunto diferente de componentes + sistemas.
- **Física** (`src/physics/`): gravidade, flutuação em água, atrito por
  material de terreno (gelo escorrega, lama trava), colisão com paredes/chão
  via grade de tiles (`TileMap`).
- **Sprites** (`src/sprites/`): importador de spritesheet (grade fixa ou
  atlas JSON) + editor de pixel art em `editor.html` (desenhar, importar
  imagem existente, exportar PNG).
- **Motor de eventos** (`src/events/`): camada "condição → ação" — o mesmo
  modelo do event sheet do Construct 2/3, só que como dados (`Rule`), pra
  depois ganhar uma UI visual de blocos arrastáveis sem precisar programar.
  Ver exemplo real em `src/main.ts` (dica automática sobre o baú escondido).
- **Segredos/surpresas** (`src/secrets/`): baús, itens ocultos, gatilhos —
  a peça que você descreveu como "nada anda no jogo sem isso".
- **Módulos de gênero** (`src/modules/`):
  - `arcade/`: controlador de movimento estilo plataforma (Mario-like).
  - `puzzle/`: grade genérica com detecção de sequências (match-3, blocos,
    cartas, tabuleiro — tudo é "grade com valor e regra de combinação").
  - `isometric/`: projeção grade↔tela e ordenação de profundidade.
- **Plugins** (`src/plugins/PluginRegistry.ts`): ponto de extensão pra 3D
  (ex.: wrapper do Three.js) e IA (pathfinding, comportamento de NPC, LLM).

## O que já roda na demo (`index.html`)

Jogador controlável (setas/AD + espaço), plataforma no ar, poça d'água que
testa a flutuação, trecho de gelo escorregadio, baú que libera uma parede
secreta ao ser aberto (`E` pra interagir), e uma dica automática via motor de
eventos se o baú ainda não foi encontrado.

## Roadmap

1. **Behaviors plugáveis** — generalizar `PlayerControlSystem` num registro
   de comportamentos (Solid, 8Direction, Sine, Pin, Physics...) que qualquer
   sprite pode receber, igual à paleta "Add behavior" do Construct.
2. **UI visual de eventos** — event sheet arrastável por cima do
   `EventSystem` atual (condições/ações já existem como dados).
3. **Editor de nível** — colocar tiles/entidades visualmente em vez de
   código (`src/demo/level.ts` hoje é escrito à mão).
4. **Wiring do puzzle/isométrico** — `GridEngine` e `IsoRenderer` já
   funcionam isolados; falta uma demo usando eles de fato.
5. **Plugin 3D** (Three.js) e **plugin de IA** via `PluginRegistry`.
6. **Export pra APK** — empacotar `dist/` (saída do `npm run build`) com
   Capacitor (`@capacitor/core` + `@capacitor/android`).
7. **Camada de assinatura/licenciamento** — gate de recursos premium
   (plugins pagos, exportação, etc.) — entra depois que o núcleo estiver
   sólido, como serviço separado (não deve virar acoplamento no engine core).
