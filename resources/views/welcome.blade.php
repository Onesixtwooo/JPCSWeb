<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        @php
            $shareMeta = $shareMeta ?? [];
            $pageTitle = $shareMeta['title'] ?? 'JPCS-OLSHCo — Build Dreams, Code Future';
            $pageDescription = $shareMeta['description'] ?? 'JPCS-OLSHCo — Junior Philippine Computer Society, Our Lady of the Sacred Heart College Chapter. Building future technology leaders.';
            $pageUrl = $shareMeta['url'] ?? url()->current();
            $pageImage = $shareMeta['image'] ?? null;
            $pageType = $shareMeta['type'] ?? 'website';
        @endphp
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="{{ $pageDescription }}">

        <meta property="og:type" content="{{ $pageType }}">
        <meta property="og:site_name" content="JPCS-OLSHCo">
        <meta property="og:title" content="{{ $pageTitle }}">
        <meta property="og:description" content="{{ $pageDescription }}">
        <meta property="og:url" content="{{ $pageUrl }}">
        @if ($pageImage)
            <meta property="og:image" content="{{ $pageImage }}">
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:image" content="{{ $pageImage }}">
        @else
            <meta name="twitter:card" content="summary">
        @endif
        <meta name="twitter:title" content="{{ $pageTitle }}">
        <meta name="twitter:description" content="{{ $pageDescription }}">

        <title>{{ $pageTitle }}</title>

        <!-- Favicon -->
        <link rel="icon" type="image/png" href="/favicon.png">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

        <!-- dotLottie Player Script -->
        <script src="https://unpkg.com/@lottiefiles/dotlottie-wc@latest/dist/dotlottie-wc.js" type="module"></script>

        <!-- Vite Assets (React + CSS) -->
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/main.jsx'])
    </head>
    <body>
        <div id="app"></div>
    </body>
</html>
