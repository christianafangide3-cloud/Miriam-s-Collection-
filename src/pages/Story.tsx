import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Users, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Story = () => {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-6 md:px-12 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs uppercase tracking-[0.4em] text-primary mb-6 block">Our Heritage</span>
            <h1 className="text-5xl md:text-8xl font-serif mb-8 italic">The Miriam Legacy</h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Rooted in tradition, crafted for tomorrow. We are redefining luxury through the lens of conscious sustainability.
            </p>
          </motion.div>
        </div>
        
        {/* Abstract background elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/3" />
      </section>

      {/* Origin Story */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-serif">How It All <span className="italic">Began</span></h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                In 2018, Miriam's Collections started with a simple belief: fashion shouldn't cost the earth. What began as a small boutique curating vintage finds quickly evolved into a mission-driven brand.
              </p>
              <p>
                We saw the devastating impact of fast fashion on both the environment and the artisans creating the garments. We decided to forge a different path—one that honors the craft, respects the planet, and empowers the wearer.
              </p>
              <p>
                Today, our collections are a testament to the fact that style and ethics can seamlessly intertwine. We don't just make clothes; we cultivate a movement.
              </p>
            </div>
            <div className="pt-4">
              <Link to="/sustainability">
                <Button variant="outline" className="rounded-full px-8 py-6 text-base group">
                  Explore our sustainable practices
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-3xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop" 
                alt="Vintage tailoring tools" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 md:-bottom-12 md:-left-12 aspect-square w-48 md:w-64 rounded-full overflow-hidden border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1558769132-cb1fac08c04b?q=80&w=800&auto=format&fit=crop" 
                alt="Sustainable fabric detail" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 px-6 md:px-12 bg-[#2D2A26] text-white">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 italic">The Pillars of Our Design</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Every seam we sew and every piece we design is guided by three unwavering principles.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center items-start">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.1 }}
               className="space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-[#E2C7A8]" />
              </div>
              <h3 className="text-2xl font-serif">Conscious Craft</h3>
              <p className="text-white/70 leading-relaxed max-w-sm mx-auto">
                We design for longevity, creating timeless silhouettes that transcend seasonal trends. Buy less, choose well.
              </p>
            </motion.div>
            
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-[#E2C7A8]" />
              </div>
              <h3 className="text-2xl font-serif">Human Dignity</h3>
              <p className="text-white/70 leading-relaxed max-w-sm mx-auto">
                We partner exclusively with artisans and small factories that guarantee fair wages and safe, respectful environments.
              </p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.3 }}
               className="space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                <Leaf className="w-8 h-8 text-[#E2C7A8]" />
              </div>
              <h3 className="text-2xl font-serif">Earth First</h3>
              <p className="text-white/70 leading-relaxed max-w-sm mx-auto">
                From organic fibers to deadstock fabrics, our materials are selected to minimize our environmental footprint.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-serif italic mb-8">Join the Movement</h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
          Discover our latest collection and become part of a community that values aesthetics and ethics equally.
        </p>
        <Link to="/">
          <Button className="rounded-full px-12 py-6 text-lg hover:scale-105 transition-transform">
            Explore the Shop
          </Button>
        </Link>
      </section>
    </div>
  );
};
