# Donorcraft: игра с другом

Donorcraft uses Horizon's built-in **Play with Friends** system. It does not require a rented Minecraft server or a Firebase game server. The launcher currently installs signed game builds from the upstream Horizon Releases repository; this fork does not yet publish a separate Donorcraft game binary.

## Before starting

- Both players need the same compatible Donorcraft game build.
- Both players need to be able to start the game and create/join a single-player world.
- Keep the game build and protocol versions the same on both computers.

## Host: share a world

1. Start Donorcraft and open the single-player world.
2. Open the single-player world, then open the pause menu and select **Friends**.
3. Choose **Start Sharing**. The game opens the world to LAN and creates a new invite code.
4. Copy the invite code and send it privately to your friend. Treat the code like a temporary password: anyone who has it may be able to join while sharing is active.
5. Keep the world open while your friend plays. Closing the world or stopping sharing ends the invite.

## Guest: join

1. Start the same Donorcraft build.
2. On the title screen, select **Friends**, then **Join a Friend** (or enter the full code through **Direct Connection**). The launcher Play page can also accept a friend code in builds that include that entry.
3. Paste the invite code and connect. The friend-code flow is in the game UI; the launcher itself does not currently have a dedicated friends/invite page.

## If the connection fails

Try these in order:

1. Both computers on the same home network: join using the invite code.
2. If you are in different homes, install the same private VPN product on both computers (for example, Tailscale or ZeroTier), connect both computers to the same private network, then create a fresh invite code.
3. If direct connection still fails (for example, both players are behind restrictive carrier-grade NAT), use a relay or a private VPN. Donorcraft does not currently provide a public relay service. The `horizon-relay` executable is only the relay program; someone must run it on a reachable machine. Then set its `host:port` in the game's **Relay** field on the Join a friend page (or set `HORIZON_RELAY_URL`). Without a running relay, this fallback cannot work.

Do not disable the Windows firewall globally or share your invite code publicly. If Windows asks to allow Donorcraft through the firewall, allow it only on the network profile you trust.

## Если у друга очень слабый интернет

Система сначала пытается соединиться напрямую по адресам из приглашения, а при наличии настроенного relay может автоматически перейти на него. Relay помогает пройти сложный NAT/CGNAT, но не ускоряет интернет и не устраняет высокий ping. По технической документации Horizon, передача через relay обычно занимает около 10–50 КБ/с во время обычной игры, а при быстром открытии новой местности может кратковременно вырасти до нескольких сотен КБ/с; скорость ограничивается на уровне сессии.

Чтобы повысить шанс стабильной игры:

- Если слабый интернет у гостя, пусть именно гость закроет фоновые загрузки, облачную синхронизацию и видео.
- Если слабый интернет у хоста, по возможности пусть мир откроет игрок с более стабильной исходящей скоростью: хост отправляет игровые данные гостю.
- Подключите ПК кабелем Ethernet, если возможно; при Wi‑Fi используйте сеть 5 ГГц рядом с роутером.
- Начните с одного гостя и небольшого расстояния прорисовки; не летайте быстро по совершенно новой местности во время проверки соединения.
- Если прямое соединение не устанавливается, используйте приватную VPN-сеть или свой relay. Публичный Donorcraft relay пока не предоставляется.
- Если соединение всё равно тормозит, это ограничение канала/задержки, а не настройка лаунчера. Нельзя обещать игру без лагов при любом качестве интернета.

## Важное ограничение для первого запуска

- The host's computer must remain on and the shared world must stay open during play. This is peer-hosted multiplayer, not an always-online cloud world.
- Firebase currently provides only the repository's initial configuration/rules. Firebase accounts, cloud snapshots, world wake/sleep, and a hosted server controller are not implemented yet.
- The fork's Windows CI game package is preliminary and must not be used as a playable release. Use the signed upstream game build offered by the launcher.
- A relay binary is a tool, not a hosted service. No public Donorcraft relay endpoint is currently promised.

See the upstream technical explanation in [Play with friends](docs/play-with-friends.md).


## Что ещё не готово

Отдельный игровой бинарник Donorcraft и собственный публичный relay ещё не опубликованы. Лаунчер использует подписанные сборки Horizon; сначала проверьте одиночный запуск, затем тестируйте приглашение другу.
