// import Image from "next/image";
import YouTubeForm from "./components/youTubeform";
import PulseReactor from "./components/PulseReactor";
import { 
  Brain, 
  FileText, 
  Image as ImageIcon, 
  Type, 
  ScrollText, 
  MessageSquareMore,
  Link,
  Sparkles,
  Lightbulb
} from "lucide-react";

const features = [
  {
    name: "AI Analysis",
    description: "Advanced AI algorithms analyze your content for optimal engagement and reach",
    icon: Brain,
    color: "from-purple-500 to-blue-500",
  },
  {
    name: "Smart Transcription",
    description: "Accurate automated transcription with multi-language support",
    icon: FileText,
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Thumbnail Generation",
    description: "Create eye-catching thumbnails that drive clicks and views",
    icon: ImageIcon,
    color: "from-orange-500 to-amber-500",
  },
  {
    name: "Title Generation",
    description: "Generate compelling, SEO-optimized titles for maximum impact",
    icon: Type,
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Shot Script Generation",
    description: "Create detailed shot-by-shot scripts for your videos automatically",
    icon: ScrollText,
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "AI Agent Discussion",
    description: "Engage in real-time conversations with your AI assistant for content strategy",
    icon: MessageSquareMore,
    color: "from-indigo-500 to-violet-500",
  },
];

const steps = [
  {
    title: "Connect your content",
    description: "Simply paste your YouTube video URL or upload your content directly to our platform",
    icon: Link,
    color: "from-blue-400 to-blue-600",
  },
  {
    title: "AI agent analysis",
    description: "Our advanced AI analyzes your content, identifying key insights and opportunities",
    icon: Sparkles,
    color: "from-purple-400 to-purple-600",
  },
  {
    title: "Receive Intelligence",
    description: "Get detailed reports and actionable recommendations to optimize your content",
    icon: Lightbulb,
    color: "from-amber-400 to-amber-600",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-100 min-h-screen">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center py-25 px-4 min-h-[80vh]">
            <div className="space-y-8 text-center max-w-3xl">
                <h1 className="text-6xl font-bold leading-tight animate-fade-in">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-600 to-cyan-600">
                Transform your youtube content with
                <span className="block mt-2 text-6xl text-blue-500">AgentTube</span>
                </span>
                </h1>
                <div className="animate-bounce my-4 flex justify-center">
                <PulseReactor />
                </div>
                <p className="text-xl text-gray-600 animate-slide-up">
                Your intelligent AI agent that revolutionizes video creation,
                delivering{" "}
                <span className="font-semibold text-blue-600">
                personalized 
                </span>{" "}
                with cutting-edge precision.
                </p>
                
            </div>
            
                <YouTubeForm />
              
              
            
          </div>
        </div>
      </section>

      {/* Feature Section  */}
      <section className="py-5 bg-white">
        <div className="container mx-auto px-4 py-16 space-y-10">
          <h1 className="text-4xl font-bold text-center">Powerful Features for your content</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.name} className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <div className={`bg-gradient-to-r ${feature.color} w-14 h-14 rounded-lg flex items-center justify-center`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 mt-4">{feature.name}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use Agent */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">AI agents in 3 steps</h2>
            <p className="text-gray-600 text-lg">Get started with AgentTube in just three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="flex flex-col items-center text-center p-6">
                  <div className={`bg-gradient-to-r ${step.color} w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 border-t-2 border-r-2 border-gray-300 transform rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
    </div>
  );
}
