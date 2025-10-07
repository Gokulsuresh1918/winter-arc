import { motion } from 'framer-motion';
import Logo from '../components/Logo';

const LogoShowcase = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-dark-700 mb-2">⚡ Momentum Logo Showcase</h1>
        <p className="text-dark-400">Complete branding and logo variations</p>
      </div>

      {/* Hero Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 text-center bg-gradient-to-br from-primary-500/5 to-purple-500/5"
      >
        <Logo size="xl" showText={true} />
        <p className="text-dark-400 mt-6 text-lg">Primary Logo - Extra Large with Text</p>
      </motion.div>

      {/* Size Variations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8"
      >
        <h2 className="text-2xl font-bold text-dark-700 mb-6">Size Variations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-dark-50 rounded-lg">
            <Logo size="xs" />
            <p className="text-sm text-dark-400 mt-4">Extra Small (24px)</p>
            <code className="text-xs text-primary-500">size="xs"</code>
          </div>

          <div className="text-center p-6 bg-dark-50 rounded-lg">
            <Logo size="sm" />
            <p className="text-sm text-dark-400 mt-4">Small (32px)</p>
            <code className="text-xs text-primary-500">size="sm"</code>
          </div>

          <div className="text-center p-6 bg-dark-50 rounded-lg">
            <Logo size="md" />
            <p className="text-sm text-dark-400 mt-4">Medium (48px)</p>
            <code className="text-xs text-primary-500">size="md"</code>
          </div>

          <div className="text-center p-6 bg-dark-50 rounded-lg">
            <Logo size="lg" />
            <p className="text-sm text-dark-400 mt-4">Large (64px)</p>
            <code className="text-xs text-primary-500">size="lg"</code>
          </div>

          <div className="text-center p-6 bg-dark-50 rounded-lg">
            <Logo size="xl" />
            <p className="text-sm text-dark-400 mt-4">Extra Large (96px)</p>
            <code className="text-xs text-primary-500">size="xl"</code>
          </div>
        </div>
      </motion.div>

      {/* With Text Variations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8"
      >
        <h2 className="text-2xl font-bold text-dark-700 mb-6">Logo with Text</h2>
        
        <div className="space-y-8">
          <div className="flex items-center justify-center p-8 bg-dark-50 rounded-lg">
            <Logo size="sm" showText={true} />
          </div>

          <div className="flex items-center justify-center p-8 bg-dark-50 rounded-lg">
            <Logo size="md" showText={true} />
          </div>

          <div className="flex items-center justify-center p-8 bg-dark-50 rounded-lg">
            <Logo size="lg" showText={true} />
          </div>
        </div>
      </motion.div>

      {/* SVG Files */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-8"
      >
        <h2 className="text-2xl font-bold text-dark-700 mb-6">SVG Logo Files</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-6 bg-dark-50 rounded-lg">
            <img src="/logo-icon.svg" alt="Icon Logo" className="w-24 h-24 mx-auto mb-4" />
            <h3 className="font-semibold text-dark-700 mb-2">Icon Logo</h3>
            <p className="text-sm text-dark-400 mb-2">100x100px</p>
            <code className="text-xs bg-dark-200 px-2 py-1 rounded text-primary-500">/logo-icon.svg</code>
          </div>

          <div className="text-center p-6 bg-dark-50 rounded-lg">
            <img src="/logo.svg" alt="Main Logo" className="w-32 h-32 mx-auto mb-4" />
            <h3 className="font-semibold text-dark-700 mb-2">Main Logo</h3>
            <p className="text-sm text-dark-400 mb-2">200x200px</p>
            <code className="text-xs bg-dark-200 px-2 py-1 rounded text-primary-500">/logo.svg</code>
          </div>

          <div className="col-span-full text-center p-6 bg-dark-50 rounded-lg">
            <img src="/logo-full.svg" alt="Full Logo" className="h-24 mx-auto mb-4" />
            <h3 className="font-semibold text-dark-700 mb-2">Full Logo with Text</h3>
            <p className="text-sm text-dark-400 mb-2">400x120px</p>
            <code className="text-xs bg-dark-200 px-2 py-1 rounded text-primary-500">/logo-full.svg</code>
          </div>

          <div className="text-center p-6 bg-dark-50 rounded-lg">
            <img src="/favicon.svg" alt="Favicon" className="w-16 h-16 mx-auto mb-4" />
            <h3 className="font-semibold text-dark-700 mb-2">Favicon</h3>
            <p className="text-sm text-dark-400 mb-2">32x32px</p>
            <code className="text-xs bg-dark-200 px-2 py-1 rounded text-primary-500">/favicon.svg</code>
          </div>
        </div>
      </motion.div>

      {/* Color Palette */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-8"
      >
        <h2 className="text-2xl font-bold text-dark-700 mb-6">Brand Colors</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="w-full h-24 rounded-lg mb-2" style={{ background: '#0ea5e9' }}></div>
            <p className="text-sm font-semibold text-dark-700">Primary Blue</p>
            <code className="text-xs text-dark-400">#0ea5e9</code>
          </div>

          <div className="text-center">
            <div className="w-full h-24 rounded-lg mb-2" style={{ background: '#6366f1' }}></div>
            <p className="text-sm font-semibold text-dark-700">Indigo</p>
            <code className="text-xs text-dark-400">#6366f1</code>
          </div>

          <div className="text-center">
            <div className="w-full h-24 rounded-lg mb-2" style={{ background: '#a855f7' }}></div>
            <p className="text-sm font-semibold text-dark-700">Purple</p>
            <code className="text-xs text-dark-400">#a855f7</code>
          </div>

          <div className="text-center">
            <div className="w-full h-24 rounded-lg mb-2" style={{ background: '#fbbf24' }}></div>
            <p className="text-sm font-semibold text-dark-700">Gold</p>
            <code className="text-xs text-dark-400">#fbbf24</code>
          </div>

          <div className="text-center">
            <div className="w-full h-24 rounded-lg mb-2" style={{ background: '#f59e0b' }}></div>
            <p className="text-sm font-semibold text-dark-700">Orange</p>
            <code className="text-xs text-dark-400">#f59e0b</code>
          </div>
        </div>
      </motion.div>

      {/* Design Elements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-8"
      >
        <h2 className="text-2xl font-bold text-dark-700 mb-6">Design Elements & Symbolism</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4 p-4 bg-dark-50 rounded-lg">
            <div className="text-4xl">⚡</div>
            <div>
              <h3 className="font-semibold text-dark-700 mb-1">Lightning Bolt</h3>
              <p className="text-sm text-dark-400">Energy, power, instant transformation</p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-dark-50 rounded-lg">
            <div className="text-4xl">🚀</div>
            <div>
              <h3 className="font-semibold text-dark-700 mb-1">Forward Motion Arcs</h3>
              <p className="text-sm text-dark-400">Progress, momentum, continuous movement</p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-dark-50 rounded-lg">
            <div className="text-4xl">🎯</div>
            <div>
              <h3 className="font-semibold text-dark-700 mb-1">Gradient Circle</h3>
              <p className="text-sm text-dark-400">Wholeness, journey, growth</p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-dark-50 rounded-lg">
            <div className="text-4xl">✨</div>
            <div>
              <h3 className="font-semibold text-dark-700 mb-1">Energy Particles</h3>
              <p className="text-sm text-dark-400">Small wins, daily progress</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Usage Examples */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-8"
      >
        <h2 className="text-2xl font-bold text-dark-700 mb-6">Usage Examples</h2>
        
        <div className="space-y-4">
          <div className="bg-dark-50 rounded-lg p-4">
            <code className="text-sm text-dark-600">
              {'<Logo size="md" />'}
            </code>
          </div>

          <div className="bg-dark-50 rounded-lg p-4">
            <code className="text-sm text-dark-600">
              {'<Logo size="lg" showText={true} />'}
            </code>
          </div>

          <div className="bg-dark-50 rounded-lg p-4">
            <code className="text-sm text-dark-600">
              {'<Logo size="xl" showText={true} animated={false} />'}
            </code>
          </div>

          <div className="bg-dark-50 rounded-lg p-4">
            <code className="text-sm text-dark-600">
              {'<img src="/logo-full.svg" alt="Momentum" />'}
            </code>
          </div>
        </div>
      </motion.div>

      {/* Download Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card p-8 text-center bg-gradient-to-br from-primary-500/10 to-purple-500/10"
      >
        <h2 className="text-2xl font-bold text-dark-700 mb-4">📦 Logo Assets</h2>
        <p className="text-dark-400 mb-6">All logo files are available in the <code className="text-primary-500 bg-dark-100 px-2 py-1 rounded">frontend/public</code> folder</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <div className="glass-card px-4 py-2">
            <span className="text-sm font-semibold text-dark-700">logo.svg</span>
          </div>
          <div className="glass-card px-4 py-2">
            <span className="text-sm font-semibold text-dark-700">logo-icon.svg</span>
          </div>
          <div className="glass-card px-4 py-2">
            <span className="text-sm font-semibold text-dark-700">logo-full.svg</span>
          </div>
          <div className="glass-card px-4 py-2">
            <span className="text-sm font-semibold text-dark-700">favicon.svg</span>
          </div>
        </div>

        <p className="text-sm text-dark-400 mt-6">
          Check <code className="text-primary-500">LOGO_GUIDE.md</code> for complete documentation
        </p>
      </motion.div>
    </div>
  );
};

export default LogoShowcase;

