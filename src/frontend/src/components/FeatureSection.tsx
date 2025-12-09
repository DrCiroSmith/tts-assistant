import { motion } from 'framer-motion';
import { Phone, Clock, Shield, Globe } from 'lucide-react';

const features = [
    {
        title: "Real-time Latency",
        desc: "Conversations happen instantly, with <300ms response times.",
        icon: <Clock className="w-8 h-8 text-blue-500" />,
        colSpan: "col-span-1 md:col-span-2",
    },
    {
        title: "Bilingual Support",
        desc: "Seamlessly switches between English and Spanish.",
        icon: <Globe className="w-8 h-8 text-green-500" />,
        colSpan: "col-span-1",
    },
    {
        title: "Secure & Private",
        desc: "Enterprise-grade encryption and PII redaction.",
        icon: <Shield className="w-8 h-8 text-purple-500" />,
        colSpan: "col-span-1",
    },
    {
        title: "Telephony Integration",
        desc: "Works with your existing phone number via Twilio.",
        icon: <Phone className="w-8 h-8 text-orange-500" />,
        colSpan: "col-span-1 md:col-span-2",
    },
];

export const FeatureSection = () => {
    return (
        <section className="py-24 bg-apple-gray">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-semibold mb-4">Powerful simplicity.</h2>
                    <p className="text-xl text-gray-500">Everything you need to automate your calls.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow ${feature.colSpan}`}
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
