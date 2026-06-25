<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
// Absolute origin from the incoming request — works on any deploy URL without hardcoding
const url = useRequestURL()
const ogImage = `${url.origin}/og-image.png`

const title = "Barcelona Verda · Espais verds de Barcelona"
const description = "La porta d'entrada als espais verds de Barcelona: descobreix parcs, horts, jardins i programes oficials en un sol mapa interactiu."

// Social link previews (WhatsApp, Telegram, X, etc.)
useSeoMeta({
  title,
  description,
  ogType: 'website',
  ogSiteName: 'Barcelona Verda',
  ogTitle: title,
  ogDescription: description,
  ogUrl: url.href,
  ogImage: ogImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Barcelona Verda',
  ogLocale: 'ca_ES',
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: ogImage,
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f8f9f4;
  color: #1a2e1a;
}
</style>
