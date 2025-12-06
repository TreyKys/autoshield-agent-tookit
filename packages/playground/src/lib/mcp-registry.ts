import { MCPServer, MCPServerDirectory, MCPServerInput } from '@/types/mcp-server';

// Registry configuration
// Use our local proxy to avoid CORS issues
const DEFAULT_REGISTRY_URL = '/api/registry';
const CACHE_KEY = 'mcp-registry-cache';
const CACHE_TIMESTAMP_KEY = 'mcp-registry-timestamp';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// Compression utilities using native Web APIs
function compressData(data: string): string {
  try {
    return btoa(data);
  } catch (error) {
    console.warn('Failed to compress data, storing uncompressed:', error);
    return data;
  }
}

function decompressData(data: string): string {
  try {
    return atob(data);
  } catch (error) {
    console.warn('Failed to decompress data, assuming uncompressed:', error);
    return data;
  }
}

// Types for the official registry response
interface OfficialRegistryServer {
  server: {
    name: string;
    description: string;
    repository?: {
      url: string;
      source: string;
    };
    version: string;
    packages?: Array<{
      registryType: string;
      identifier: string;
    }>;
    remotes?: Array<{
      type: string;
      url: string;
    }>;
  };
  _meta?: {
    [key: string]: {
      status: string;
      publishedAt: string;
      updatedAt: string;
    };
  };
}

interface OfficialRegistryResponse {
  servers: OfficialRegistryServer[];
  metadata?: {
    nextCursor?: string;
    count?: number;
  };
}

// Legacy format interface (keeping for backward compat just in case)
interface LegacyRegistryServer {
  id: string;
  git_repository: string;
  unique_name: string;
  short_description: string;
  versions: Array<{
    tag: string;
    name: string;
    date: string;
    prerelease: boolean;
    commit: string;
  }>;
  // ... other legacy fields
  created_at: string;
  updated_at: string;
}

// Check if cached data is still valid
function isCacheValid(): boolean {
  try {
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp) return false;
    
    const cacheTime = parseInt(timestamp, 10);
    const now = Date.now();
    return (now - cacheTime) < CACHE_DURATION;
  } catch (error) {
    console.warn('Error checking cache validity:', error);
    return false;
  }
}

// Load cached registry data
function loadCachedRegistry(): MCPServerDirectory | null {
  try {
    if (!isCacheValid()) {
      console.log('🕐 Cache expired, will fetch fresh data');
      return null;
    }

    const compressed = localStorage.getItem(CACHE_KEY);
    if (!compressed) {
      console.log('📭 No cached registry data found');
      return null;
    }

    const data = decompressData(compressed);
    const registry = JSON.parse(data) as MCPServerDirectory;
    
    console.log('✅ Loaded cached registry data:', {
      serverCount: registry.servers.length,
      cacheAge: Math.round((Date.now() - parseInt(localStorage.getItem(CACHE_TIMESTAMP_KEY) || '0', 10)) / 1000 / 60)
    });
    
    return registry;
  } catch (error) {
    console.error('❌ Error loading cached registry:', error);
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    return null;
  }
}

// Save registry data to cache with compression
function saveCachedRegistry(registry: MCPServerDirectory): void {
  try {
    const data = JSON.stringify(registry);
    const compressed = compressData(data);
    
    localStorage.setItem(CACHE_KEY, compressed);
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    
    const originalSize = new Blob([data]).size;
    const compressedSize = new Blob([compressed]).size;
    const savings = Math.round((1 - compressedSize / originalSize) * 100);
    
    console.log('💾 Registry cached successfully:', {
      servers: registry.servers.length,
      originalSize: `${Math.round(originalSize / 1024)}KB`,
      compressedSize: `${Math.round(compressedSize / 1024)}KB`,
      compressionSavings: `${savings}%`
    });
  } catch (error) {
    console.error('❌ Error saving registry to cache:', error);
  }
}

// Transform official registry server to our MCPServer format
function transformOfficialServer(entry: OfficialRegistryServer): MCPServer {
  const { server, _meta } = entry;
  
  const id = server.name;
  const uniqueName = server.name;
  const shortDescription = server.description;
  const gitUrl = server.repository?.url || '';

  const metadata = _meta && Object.values(_meta)[0];
  const updatedAt = metadata?.updatedAt || new Date().toISOString();
  const createdAt = metadata?.publishedAt || new Date().toISOString();

  // Try to determine command from packages
  let command = 'npx';
  let args: string[] = [];

  // Note: The official registry mainly lists docker/http, not NPX args directly.
  // We'll have to adapt or allow all servers.
  // For now, let's map what we can.

  return {
    id,
    git_repository: gitUrl,
    unique_name: uniqueName,
    short_description: shortDescription,
    versions: [{
      tag: server.version,
      hash: 'latest',
      date: updatedAt
    }],
    keywords: [],
    license: 'Unknown',
    license_url: '',
    mcp_server_config: { mcpServers: {} }, // Official registry structure differs
    created_at: createdAt,
    updated_at: updatedAt,
    mcp_server_inputs: '[]',
    tags: '[]',

    // Computed fields
    name: uniqueName.split('/').pop() || uniqueName,
    shortDescription: shortDescription,
    mcpServerConfig: { command: '', args: [], env: {} }, // Placeholder
    inputs: [],
    parsedTags: [],
    licenses: [],
    category: 'Dev Tools',
    author: uniqueName.split('/')[0] || 'Unknown',
    homepage: gitUrl,
    documentation: gitUrl,
    lastUpdated: updatedAt,
    searchText: `${uniqueName} ${shortDescription}`.toLowerCase(),
    popularity: 50
  };
}

// Legacy transform for backward compatibility if user provides their own registry
function transformLegacyServer(server: LegacyRegistryServer): MCPServer {
  // ... (previous logic simplified for brevity but kept functional)
  return {
    id: server.id,
    git_repository: server.git_repository,
    unique_name: server.unique_name,
    short_description: server.short_description,
    versions: server.versions.map(v => ({ tag: v.tag, hash: v.commit, date: v.date })),
    keywords: [],
    license: '',
    license_url: '',
    mcp_server_config: { mcpServers: {} },
    created_at: server.created_at,
    updated_at: server.updated_at,
    mcp_server_inputs: '[]',
    tags: '[]',
    name: server.unique_name.split('/')[1] || server.unique_name,
    shortDescription: server.short_description,
    mcpServerConfig: { command: '', args: [], env: {} },
    inputs: [],
    parsedTags: [],
    licenses: [],
    category: 'Dev Tools',
    author: server.unique_name.split('/')[0],
    homepage: server.git_repository,
    documentation: server.git_repository,
    lastUpdated: server.updated_at,
    searchText: server.unique_name.toLowerCase(),
    popularity: 50
  };
}


// Main function to fetch and process registry data
export async function fetchMCPRegistry(): Promise<MCPServerDirectory> {
  console.log('🚀 Fetching MCP registry data...');
  
  const cachedRegistry = loadCachedRegistry();
  if (cachedRegistry) return cachedRegistry;

  // Use the proxy API route by default
  // Allow override via env var, but validate it
  let registryUrl = process.env.NEXT_PUBLIC_MCP_REGISTRY_URL || DEFAULT_REGISTRY_URL;

  // If the env var is the old broken nullshot URL, force default
  if (registryUrl.includes('mcp-registry.nullshot.ai')) {
      console.warn('⚠️ Detected deprecated/broken NullShot registry URL, using default proxy');
      registryUrl = DEFAULT_REGISTRY_URL;
  }

  console.log('🌐 Fetching from:', registryUrl);

  try {
    const response = await fetch(registryUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const rawData = await response.json();
    let transformedServers: MCPServer[] = [];

    // Detect format
    if (rawData.servers && rawData.servers.length > 0) {
       if (rawData.servers[0].server) {
           // Official format
           console.log('📦 Detected Official Registry format');
           transformedServers = (rawData as OfficialRegistryResponse).servers.map(transformOfficialServer);
       } else {
           // Legacy format
           console.log('📦 Detected Legacy Registry format');
           transformedServers = (rawData.servers as LegacyRegistryServer[]).map(transformLegacyServer);
       }
    }

    const processedRegistry: MCPServerDirectory = {
      servers: transformedServers,
      lastFetched: new Date().toISOString(),
      version: '1.0'
    };

    saveCachedRegistry(processedRegistry);
    return processedRegistry;

  } catch (error) {
    console.error('❌ Error fetching MCP registry:', error);
    
    // Fallback
    try {
      const compressed = localStorage.getItem(CACHE_KEY);
      if (compressed) {
        return JSON.parse(decompressData(compressed)) as MCPServerDirectory;
      }
    } catch (e) {}
    
    // Return empty if everything fails
    return { servers: [], lastFetched: new Date().toISOString(), version: '1.0' };
  }
}

export function clearRegistryCache(): void {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  console.log('🧹 Registry cache cleared');
}

export function isRegistryCached(): boolean {
  return isCacheValid() && localStorage.getItem(CACHE_KEY) !== null;
}
