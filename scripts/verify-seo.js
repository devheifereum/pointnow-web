#!/usr/bin/env node

/**
 * SEO Verification Script
 * Checks if your SEO setup is correct and accessible
 */

const https = require('https');
const http = require('http');

const domain = 'www.pointnow.io';
const baseUrl = `https://${domain}`;

const checks = [];

function checkUrl(url, description) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const success = res.statusCode === 200;
        checks.push({
          description,
          url,
          status: success ? '✅ PASS' : '❌ FAIL',
          statusCode: res.statusCode,
          details: success ? 'Accessible' : `HTTP ${res.statusCode}`,
        });
        resolve(success);
      });
    });

    req.on('error', (error) => {
      checks.push({
        description,
        url,
        status: '❌ FAIL',
        statusCode: 'N/A',
        details: error.message,
      });
      resolve(false);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      checks.push({
        description,
        url,
        status: '❌ FAIL',
        statusCode: 'TIMEOUT',
        details: 'Request timed out',
      });
      resolve(false);
    });
  });
}

async function verifyRobotsTxt() {
  const url = `${baseUrl}/robots.txt`;
  const result = await checkUrl(url, 'robots.txt accessibility');
  
  if (result) {
    const https = require('https');
    return new Promise((resolve) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          const hasSitemap = data.includes('sitemap.xml');
          const allowsAll = data.includes('Allow: /') || data.includes('allow: /');
          
          checks.push({
            description: 'robots.txt contains sitemap reference',
            url: url,
            status: hasSitemap ? '✅ PASS' : '⚠️  WARN',
            statusCode: res.statusCode,
            details: hasSitemap ? 'Sitemap found' : 'Sitemap not found in robots.txt',
          });
          
          checks.push({
            description: 'robots.txt allows crawling',
            url: url,
            status: allowsAll ? '✅ PASS' : '⚠️  WARN',
            statusCode: res.statusCode,
            details: allowsAll ? 'Allows crawling' : 'Check if crawling is allowed',
          });
          
          resolve();
        });
      }).on('error', () => resolve());
    });
  }
}

async function verifySitemap() {
  const url = `${baseUrl}/sitemap.xml`;
  const result = await checkUrl(url, 'sitemap.xml accessibility');
  
  if (result) {
    const https = require('https');
    return new Promise((resolve) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          const isValidXml = data.includes('<?xml') || data.includes('<urlset');
          const hasUrls = data.includes('<url>') || data.includes('<loc>');
          
          checks.push({
            description: 'sitemap.xml is valid XML',
            url: url,
            status: isValidXml ? '✅ PASS' : '❌ FAIL',
            statusCode: res.statusCode,
            details: isValidXml ? 'Valid XML format' : 'Invalid XML format',
          });
          
          checks.push({
            description: 'sitemap.xml contains URLs',
            url: url,
            status: hasUrls ? '✅ PASS' : '⚠️  WARN',
            statusCode: res.statusCode,
            details: hasUrls ? 'Contains URLs' : 'No URLs found',
          });
          
          resolve();
        });
      }).on('error', () => resolve());
    });
  }
}

async function verifyHomepage() {
  const url = baseUrl;
  const result = await checkUrl(url, 'Homepage accessibility');
  
  if (result) {
    const https = require('https');
    return new Promise((resolve) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          const hasTitle = data.includes('<title>') || data.includes('PointNow');
          const hasMetaDescription = data.includes('meta name="description"') || 
                                    data.includes('meta property="og:description"');
          const hasCanonical = data.includes('canonical') || data.includes('rel="canonical"');
          const hasOpenGraph = data.includes('og:title') || data.includes('property="og:');
          
          checks.push({
            description: 'Homepage has title tag',
            url: url,
            status: hasTitle ? '✅ PASS' : '❌ FAIL',
            statusCode: res.statusCode,
            details: hasTitle ? 'Title tag found' : 'Title tag missing',
          });
          
          checks.push({
            description: 'Homepage has meta description',
            url: url,
            status: hasMetaDescription ? '✅ PASS' : '⚠️  WARN',
            statusCode: res.statusCode,
            details: hasMetaDescription ? 'Meta description found' : 'Meta description missing',
          });
          
          checks.push({
            description: 'Homepage has canonical URL',
            url: url,
            status: hasCanonical ? '✅ PASS' : '⚠️  WARN',
            statusCode: res.statusCode,
            details: hasCanonical ? 'Canonical URL found' : 'Canonical URL missing',
          });
          
          checks.push({
            description: 'Homepage has Open Graph tags',
            url: url,
            status: hasOpenGraph ? '✅ PASS' : '⚠️  WARN',
            statusCode: res.statusCode,
            details: hasOpenGraph ? 'Open Graph tags found' : 'Open Graph tags missing',
          });
          
          resolve();
        });
      }).on('error', () => resolve());
    });
  }
}

async function runAllChecks() {
  console.log('\n🔍 SEO Verification Report\n');
  console.log(`Domain: ${domain}\n`);
  console.log('Running checks...\n');
  
  await verifyHomepage();
  await verifyRobotsTxt();
  await verifySitemap();
  
  console.log('Results:\n');
  console.log('─'.repeat(80));
  
  checks.forEach((check) => {
    console.log(`${check.status} ${check.description}`);
    console.log(`   URL: ${check.url}`);
    console.log(`   Status: ${check.statusCode}`);
    console.log(`   Details: ${check.details}`);
    console.log('');
  });
  
  console.log('─'.repeat(80));
  
  const passed = checks.filter(c => c.status.includes('✅')).length;
  const failed = checks.filter(c => c.status.includes('❌')).length;
  const warnings = checks.filter(c => c.status.includes('⚠️')).length;
  
  console.log(`\nSummary:`);
  console.log(`  ✅ Passed: ${passed}`);
  console.log(`  ⚠️  Warnings: ${warnings}`);
  console.log(`  ❌ Failed: ${failed}`);
  
  if (failed === 0 && warnings === 0) {
    console.log(`\n🎉 All checks passed! Your SEO setup looks good.`);
    console.log(`\nNext steps:`);
    console.log(`  1. Submit your site to Google Search Console`);
    console.log(`  2. Submit your sitemap: ${baseUrl}/sitemap.xml`);
    console.log(`  3. Request indexing for your homepage`);
    console.log(`  4. Check indexing status: site:${domain}`);
  } else {
    console.log(`\n⚠️  Some issues found. Please review the details above.`);
  }
  
  console.log('\n');
}

runAllChecks().catch(console.error);




