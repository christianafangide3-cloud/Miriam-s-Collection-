import { motion } from "motion/react";
import { Leaf, ShieldCheck, Globe, Recycle, Heart, Droplets } from "lucide-react";

export const Sustainability = () => {
  return (
    <div className="min-h-screen bg-[#f8f6f2] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-primary mb-4 block">Our Commitment</span>
          <h1 className="text-5xl md:text-7xl font-serif mb-8 italic">Better for the Earth, Better for You</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Sustainable fashion isn't a trend; it's our core responsibility. At MIRIAM'S COLLECTIONS, we believe in a circular future where style and stewardship coexist.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-serif mb-3">Eco-Certified Materials</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We use GOTS-certified organic cotton, recycled polyester from ocean plastic, and regenerative fibers that help heal the soil.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-serif mb-3">Ethical Production</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every garment is made in factories with safe working conditions, living wages, and no child labor. We know every person who makes our clothes.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Droplets className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-serif mb-3">Water Preservation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our dyeing processes use 85% less water than industry standards and ensure zero hazardous chemicals are released into the environment.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden aspect-[4/5]"
          >
            <img 
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop" 
              alt="Sustainable Factory"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        <div className="bg-white rounded-[3rem] p-12 md:p-24 shadow-sm text-center">
          <h2 className="text-4xl font-serif mb-12">Our Sustainable Goals</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-4 text-center">
              <div className="text-4xl font-serif text-primary italic">100%</div>
              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Certified Organic</p>
            </div>
            <div className="space-y-4 text-center">
              <div className="text-4xl font-serif text-primary italic">ZERO</div>
              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Single-use Plastic</p>
            </div>
            <div className="space-y-4 text-center">
              <div className="text-4xl font-serif text-primary italic">50k+</div>
              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Liters Water Saved</p>
            </div>
            <div className="space-y-4 text-center">
              <div className="text-4xl font-serif text-primary italic">5%</div>
              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Profit to Oceans</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
