<?php
/**
 * DJ Wulf Web Platform - Full Installation Script
 * Installs full database tables, initial tracks, tour dates, media, forum, chat, and configuration.
 *
 * @license Apache-2.0
 * @author DJ Wulf Engineering
 */

declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '1');

$step = isset($_GET['step']) ? (int)$_GET['step'] : 1;
$error = '';
$success = '';

// Default DB Settings
$dbType = $_POST['db_type'] ?? 'sqlite';
$dbHost = $_POST['db_host'] ?? '127.0.0.1';
$dbPort = $_POST['db_port'] ?? '3306';
$dbName = $_POST['db_name'] ?? 'dj_wulf_db';
$dbUser = $_POST['db_user'] ?? 'root';
$dbPass = $_POST['db_pass'] ?? '';
$adminEmail = $_POST['admin_email'] ?? 'admin@djwulf.com';
$adminPass = $_POST['admin_pass'] ?? 'wulfpack2026!';

// Check PHP Requirements
$requirements = [
    'PHP Version >= 8.0' => version_compare(PHP_VERSION, '8.0.0', '>='),
    'PDO Extension' => extension_loaded('pdo'),
    'PDO SQLite Extension' => extension_loaded('pdo_sqlite'),
    'JSON Extension' => extension_loaded('json'),
    'cURL Extension' => extension_loaded('curl'),
    'OpenSSL Extension' => extension_loaded('openssl'),
    'Directory Writable' => is_writable(__DIR__),
];
$allRequirementsMet = !in_array(false, $requirements, true);

// Execute Installation on POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'install') {
    try {
        if ($dbType === 'sqlite') {
            $dbPath = __DIR__ . '/database.sqlite';
            $pdo = new PDO("sqlite:" . $dbPath);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } else {
            $dsn = "mysql:host={$dbHost};port={$dbPort};charset=utf8mb4";
            $pdo = new PDO($dsn, $dbUser, $dbPass);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
            $pdo->exec("USE `{$dbName}`;");
        }

        // 1. Create Tables
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS wulf_tracks (
                id VARCHAR(64) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                artist VARCHAR(255) NOT NULL,
                duration_formatted VARCHAR(32) NOT NULL,
                duration_seconds INT NOT NULL,
                bpm INT NOT NULL,
                track_key VARCHAR(32) NOT NULL,
                genre VARCHAR(64) NOT NULL,
                release_date VARCHAR(64) NOT NULL,
                cover_gradient VARCHAR(255) NOT NULL,
                synth_preset VARCHAR(64) NOT NULL,
                plays_count INT DEFAULT 0,
                likes_count INT DEFAULT 0,
                description TEXT,
                tracklist_json TEXT,
                streaming_links_json TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS wulf_tour_dates (
                id VARCHAR(64) PRIMARY KEY,
                city VARCHAR(128) NOT NULL,
                country VARCHAR(128) NOT NULL,
                venue VARCHAR(255) NOT NULL,
                event_name VARCHAR(255) NOT NULL,
                event_date VARCHAR(64) NOT NULL,
                day_number VARCHAR(16) NOT NULL,
                month_year VARCHAR(32) NOT NULL,
                iso_date VARCHAR(64) NOT NULL,
                type VARCHAR(32) NOT NULL,
                ticket_status VARCHAR(64) NOT NULL,
                ticket_price VARCHAR(32),
                stage_time VARCHAR(64),
                ticket_url VARCHAR(512),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS wulf_playlists (
                id VARCHAR(64) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                curated_by VARCHAR(128) NOT NULL,
                description TEXT,
                track_count INT DEFAULT 0,
                duration VARCHAR(64),
                genre VARCHAR(64),
                links_json TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS wulf_media (
                id VARCHAR(64) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                type VARCHAR(32) NOT NULL,
                category VARCHAR(64) NOT NULL,
                date VARCHAR(64),
                location VARCHAR(128),
                photographer VARCHAR(128),
                svg_icon VARCHAR(64),
                description TEXT,
                likes INT DEFAULT 0,
                aspect_ratio VARCHAR(32),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS wulf_forum_threads (
                id VARCHAR(64) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                author_name VARCHAR(128) NOT NULL,
                author_badge VARCHAR(64) NOT NULL,
                author_avatar VARCHAR(32),
                category VARCHAR(64) NOT NULL,
                created_at_label VARCHAR(64),
                replies_count INT DEFAULT 0,
                views_count INT DEFAULT 0,
                likes_count INT DEFAULT 0,
                is_pinned TINYINT(1) DEFAULT 0,
                tags_json TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS wulf_forum_replies (
                id VARCHAR(64) PRIMARY KEY,
                thread_id VARCHAR(64) NOT NULL,
                author_name VARCHAR(128) NOT NULL,
                author_badge VARCHAR(64) NOT NULL,
                author_avatar VARCHAR(32),
                content TEXT NOT NULL,
                created_at_label VARCHAR(64),
                likes INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS wulf_backstage_chat (
                id VARCHAR(64) PRIMARY KEY,
                track_id VARCHAR(64) NOT NULL,
                author_name VARCHAR(128) NOT NULL,
                author_badge VARCHAR(64) NOT NULL,
                author_avatar VARCHAR(32),
                content TEXT NOT NULL,
                timestamp VARCHAR(32),
                likes INT DEFAULT 0,
                is_system TINYINT(1) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS wulf_subscribers (
                id VARCHAR(64) PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(128),
                subscribed_at VARCHAR(64),
                perk_claimed TINYINT(1) DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS wulf_bookings (
                id VARCHAR(64) PRIMARY KEY,
                organizer_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(64),
                event_name VARCHAR(255) NOT NULL,
                event_type VARCHAR(64) NOT NULL,
                event_date VARCHAR(64) NOT NULL,
                location VARCHAR(255) NOT NULL,
                expected_guests VARCHAR(64),
                budget_bracket VARCHAR(64),
                message TEXT,
                status VARCHAR(64) DEFAULT 'Neu',
                submitted_at VARCHAR(64),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS wulf_users (
                id VARCHAR(64) PRIMARY KEY,
                name VARCHAR(128) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(32) DEFAULT 'user',
                badge VARCHAR(64) DEFAULT 'Wolfpack VIP',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        ");

        // 2. Insert Default Admin User
        $adminStmt = $pdo->prepare("INSERT OR REPLACE INTO wulf_users (id, name, email, password_hash, role, badge) VALUES (?, ?, ?, ?, ?, ?)");
        $adminHash = password_hash($adminPass, PASSWORD_BCRYPT);
        $adminStmt->execute(['admin-1', 'DJ Wulf Admin', $adminEmail, $adminHash, 'admin', 'Producer']);

        // 3. Seed Initial Tracks
        $trackStmt = $pdo->prepare("INSERT OR REPLACE INTO wulf_tracks (id, title, artist, duration_formatted, duration_seconds, bpm, track_key, genre, release_date, cover_gradient, synth_preset, plays_count, likes_count, description, tracklist_json, streaming_links_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $trackStmt->execute([
            'track-1',
            'Midnight Protocol (Club Mix)',
            'DJ Wulf',
            '06:14',
            374,
            126,
            'F Minor',
            'Melodic Techno',
            'Oktober 2026',
            'from-black via-zinc-900 to-black',
            'midnight',
            284500,
            14200,
            'Treibende Melodic-Techno Hymne mit rollendem Sub-Bass und analogem Synthesizer-Aufbau für den Primetime Club-Slot.',
            json_encode([
                ['time' => '00:00', 'title' => 'Intro Atmosphere & Sub Pulsing', 'artist' => 'DJ Wulf'],
                ['time' => '01:32', 'title' => 'Modular Lead Intro', 'artist' => 'DJ Wulf'],
                ['time' => '03:15', 'title' => 'The Main Drop', 'artist' => 'DJ Wulf'],
            ]),
            json_encode(['spotify' => 'https://open.spotify.com', 'beatport' => 'https://beatport.com'])
        ]);

        $trackStmt->execute([
            'track-2',
            'Pack Anthem (Festival Overdrive)',
            'DJ Wulf x KRONOS',
            '05:38',
            338,
            132,
            'A Minor',
            'Festival EDM',
            'September 2026',
            'from-zinc-950 via-zinc-900 to-black',
            'anthem',
            412000,
            22800,
            'Große Festival-Hook mit explosiven Drops und energetischem Sägezahn-Lead.',
            json_encode([['time' => '00:00', 'title' => 'Intro', 'artist' => 'DJ Wulf']]),
            json_encode(['spotify' => 'https://open.spotify.com', 'beatport' => 'https://beatport.com'])
        ]);

        // 4. Seed Tour Dates
        $tourStmt = $pdo->prepare("INSERT OR REPLACE INTO wulf_tour_dates (id, city, country, venue, event_name, event_date, day_number, month_year, iso_date, type, ticket_status, ticket_price, stage_time, ticket_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $tourStmt->execute(['tour-1', 'Berlin', 'Deutschland', 'Watergate Club', 'Wolfpack Club Night: Extended 4h Set', '14. Nov 2026', '14', 'NOV 2026', '2026-11-14T23:00:00', 'Club', 'Fast Ausverkauft', '22,00 €', '01:30 - 05:30', 'https://ra.co']);
        $tourStmt->execute(['tour-2', 'Amsterdam', 'Niederlande', 'Warehouse Elementenstraat', 'ADE Hangover Series', '21. Nov 2026', '21', 'NOV 2026', '2026-11-21T22:00:00', 'Club', 'Verfügbar', '28,50 €', '02:00 - 04:30', 'https://ticketmaster.com']);
        $tourStmt->execute(['tour-3', 'Zürich', 'Schweiz', 'Halle 622', 'Winter Electro Gala', '05. Dez 2026', '05', 'DEZ 2026', '2026-12-05T20:00:00', 'Festival', 'Verfügbar', '45,00 CHF', '23:00 - 01:00', 'https://starticket.ch']);
        $tourStmt->execute(['tour-4', 'Wien', 'Österreich', 'Pratersauna', 'Dark Winter Resonance', '12. Dez 2026', '12', 'DEZ 2026', '2026-12-12T23:30:00', 'Club', 'Gästeliste', '18,00 €', '01:00 - 04:00', 'https://ntry.at']);
        $tourStmt->execute(['tour-5', 'München', 'Deutschland', 'Zenith Halle', 'Silvester Neon Rave 2027', '31. Dez 2026', '31', 'DEZ 2026', '2026-12-31T21:00:00', 'Festival', 'Ausverkauft', '55,00 €', '23:30 - 02:00', 'https://eventim.de']);

        // 5. Seed Backstage Chat Messages
        $chatStmt = $pdo->prepare("INSERT OR REPLACE INTO wulf_backstage_chat (id, track_id, author_name, author_badge, author_avatar, content, timestamp, likes, is_system) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $chatStmt->execute(['chat-1', 'track-1', 'DJ BOOTH', 'DJ BOOTH', 'WULF', '🎧 Live auf Deck: Midnight Protocol (Club Mix) [126 BPM · F Minor]', '23:41', 18, 1]);
        $chatStmt->execute(['chat-2', 'track-1', 'Sarah_Beats', 'Resident', 'SB', 'Dieser analoge Moog Sub-Bass schiebt so brutal nach vorne! ⚡🔥', '23:42', 9, 0]);
        $chatStmt->execute(['chat-3', 'track-1', 'TechnoViktor', 'Wolfpack VIP', 'VT', 'Watergate Crowd war komplett im Ausnahmezustand bei dem Drop 🐺', '23:43', 14, 0]);

        // 6. Generate config.php
        $configContent = "<?php\n// DJ Wulf Platform Generated Configuration\nreturn [\n    'db_type' => '{$dbType}',\n    'db_host' => '{$dbHost}',\n    'db_name' => '{$dbName}',\n    'app_name' => 'DJ Wulf Official',\n    'admin_email' => '{$adminEmail}',\n    'installed_at' => '" . date('Y-m-d H:i:s') . "',\n];\n";
        file_put_contents(__DIR__ . '/config.php', $configContent);

        $step = 3; // Success screen
        $success = "DJ Wulf Plattform erfolgreich installiert! Datenbank, Tabellen und Seed-Daten sind einsatzbereit.";
    } catch (Throwable $e) {
        $error = "Installationsfehler: " . htmlspecialchars($e->getMessage());
    }
}
?>
<!DOCTYPE html>
<html lang="de" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DJ Wulf — Plattform Installation (install.php)</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&family=Plus+Jakarta+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --neon: #00ff66;
            --bg: #000000;
            --card: #09090b;
            --border: #27272a;
            --text: #ffffff;
            --muted: #a1a1aa;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background-color: var(--bg);
            color: var(--text);
            font-family: 'Plus Jakarta Sans', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }
        .container {
            max-width: 680px;
            width: 100%;
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 36px;
            box-shadow: 0 0 50px rgba(0, 255, 102, 0.12);
        }
        .header {
            display: flex;
            align-items: center;
            gap: 16px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 20px;
            margin-bottom: 28px;
        }
        .emblem {
            width: 48px;
            height: 48px;
            background: rgba(0, 255, 102, 0.1);
            border: 1px solid var(--neon);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 24px;
            font-weight: 900;
            letter-spacing: 0.05em;
        }
        .subtitle {
            color: var(--muted);
            font-size: 13px;
        }
        .alert-error {
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid #ef4444;
            color: #fca5a5;
            padding: 14px;
            border-radius: 12px;
            margin-bottom: 20px;
            font-size: 13px;
        }
        .alert-success {
            background: rgba(0, 255, 102, 0.15);
            border: 1px solid var(--neon);
            color: var(--neon);
            padding: 14px;
            border-radius: 12px;
            margin-bottom: 20px;
            font-size: 13px;
            font-weight: bold;
        }
        .form-group {
            margin-bottom: 18px;
        }
        label {
            display: block;
            font-size: 12px;
            font-weight: 700;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 6px;
        }
        input, select {
            width: 100%;
            background: #000000;
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 12px 14px;
            color: #ffffff;
            font-size: 14px;
            font-family: inherit;
        }
        input:focus, select:focus {
            outline: none;
            border-color: var(--neon);
            box-shadow: 0 0 12px rgba(0, 255, 102, 0.25);
        }
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        .btn-primary {
            width: 100%;
            background: var(--neon);
            color: #000000;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            padding: 14px;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 12px;
            box-shadow: 0 0 20px rgba(0, 255, 102, 0.35);
            transition: all 0.2s;
        }
        .btn-primary:hover {
            background: #33ff88;
            transform: scale(1.01);
        }
        .req-list {
            list-style: none;
            margin-bottom: 24px;
            font-size: 13px;
        }
        .req-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .status-ok { color: var(--neon); font-weight: bold; }
        .status-fail { color: #ef4444; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="emblem">
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                    <path d="M24 4L34 16L40 28L36 44L24 38L12 44L8 28L14 16L24 4Z" stroke="#00ff66" stroke-width="2.5" stroke-linejoin="round"/>
                    <path d="M24 4V38M14 16L24 24L34 16M8 28L24 38L40 28" stroke="#00ff66" stroke-opacity="0.6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div>
                <h1>DJ WULF INSTALLER</h1>
                <div class="subtitle">Full Stack Music & Community Web Installer</div>
            </div>
        </div>

        <?php if ($error): ?>
            <div class="alert-error"><?= $error ?></div>
        <?php endif; ?>

        <?php if ($success): ?>
            <div class="alert-success"><?= $success ?></div>
        <?php endif; ?>

        <?php if ($step === 3): ?>
            <div style="text-align: center; padding: 20px 0;">
                <div style="font-size: 48px; margin-bottom: 16px;">⚡</div>
                <h2 style="font-family: Outfit; font-size: 22px; margin-bottom: 12px; color: var(--neon);">Installation erfolgreich abgeschlossen!</h2>
                <p style="color: var(--muted); font-size: 14px; margin-bottom: 24px; line-height: 1.6;">
                    Alle 10 Datenbank-Tabellen wurden erstellt und mit Mixes, Tourdaten, Mediathek, Backstage Chat & Forum initialisiert.<br>
                    Admin-Login: <strong style="color: #fff;"><?= htmlspecialchars($adminEmail) ?></strong>
                </p>
                <a href="/" style="display: inline-block; background: var(--neon); color: #000; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 900; text-transform: uppercase;">
                    Zur DJ Wulf Webseite
                </a>
            </div>
        <?php else: ?>
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 14px; text-transform: uppercase; color: var(--neon); margin-bottom: 12px;">System-Prüfung</h3>
                <ul class="req-list">
                    <?php foreach ($requirements as $req => $met): ?>
                        <li class="req-item">
                            <span><?= htmlspecialchars($req) ?></span>
                            <span class="<?= $met ? 'status-ok' : 'status-fail' ?>"><?= $met ? 'OK ✓' : 'Fehlt ✕' ?></span>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>

            <form method="POST" action="install.php">
                <input type="hidden" name="action" value="install">
                
                <h3 style="font-size: 14px; text-transform: uppercase; color: var(--neon); margin-bottom: 12px;">Datenbank & Konfiguration</h3>
                
                <div class="form-group">
                    <label>Datenbank-Typ</label>
                    <select name="db_type">
                        <option value="sqlite" <?= $dbType === 'sqlite' ? 'selected' : '' ?>>SQLite (Empfohlen: Sofortige 0-Konfigurationsdatei)</option>
                        <option value="mysql" <?= $dbType === 'mysql' ? 'selected' : '' ?>>MySQL / MariaDB</option>
                    </select>
                </div>

                <div class="grid-2">
                    <div class="form-group">
                        <label>DB Host / Server</label>
                        <input type="text" name="db_host" value="<?= htmlspecialchars($dbHost) ?>">
                    </div>
                    <div class="form-group">
                        <label>DB Port</label>
                        <input type="text" name="db_port" value="<?= htmlspecialchars($dbPort) ?>">
                    </div>
                </div>

                <div class="grid-2">
                    <div class="form-group">
                        <label>DB Name</label>
                        <input type="text" name="db_name" value="<?= htmlspecialchars($dbName) ?>">
                    </div>
                    <div class="form-group">
                        <label>DB Benutzer</label>
                        <input type="text" name="db_user" value="<?= htmlspecialchars($dbUser) ?>">
                    </div>
                </div>

                <div class="form-group">
                    <label>DB Passwort</label>
                    <input type="password" name="db_pass" value="<?= htmlspecialchars($dbPass) ?>">
                </div>

                <h3 style="font-size: 14px; text-transform: uppercase; color: var(--neon); margin: 20px 0 12px;">Administrator Konto</h3>

                <div class="grid-2">
                    <div class="form-group">
                        <label>Admin E-Mail</label>
                        <input type="email" name="admin_email" value="<?= htmlspecialchars($adminEmail) ?>">
                    </div>
                    <div class="form-group">
                        <label>Admin Passwort</label>
                        <input type="password" name="admin_pass" value="<?= htmlspecialchars($adminPass) ?>">
                    </div>
                </div>

                <button type="submit" class="btn-primary" <?= !$allRequirementsMet ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : '' ?>>
                    Jetzt Vollständig Installieren
                </button>
            </form>
        <?php endif; ?>
    </div>
</body>
</html>
