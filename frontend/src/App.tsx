import React, { useState, useEffect } from 'react';
import { Code2, FileCode2, Users, School, ChevronDown, Upload, Download, AlertCircle, Menu, X } from 'lucide-react';
import TeamMember from './components/TeamMember';
import CodeEditor from './components/CodeEditor';
import LoadingScreen from './components/LoadingScreen';
import Modal from './components/Modal';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const features = {
    ast: {
      title: "AST-based Tokenization",
      content: (
        <>
          <p className="mb-4">
            Abstract Syntax Tree (AST) based tokenization is a sophisticated approach to analyzing code structure:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Converts source code into a tree-like representation</li>
            <li>Preserves structural relationships between code elements</li>
            <li>Enables accurate syntax-aware comparison</li>
            <li>Identifies structural similarities regardless of formatting</li>
          </ul>
          <p>
            Our system uses advanced AST parsing algorithms to break down code into meaningful tokens while maintaining their hierarchical relationships. This allows for more accurate similarity detection compared to simple text-based comparison.
          </p>
        </>
      )
    },
    semantic: {
      title: "Semantic Analysis with CodeBERT",
      content: (
        <>
          <p className="mb-4">
            CodeBERT is a state-of-the-art pre-trained language model specifically designed for source code:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Understands programming language semantics</li>
            <li>Captures contextual relationships in code</li>
            <li>Identifies semantic similarities across different implementations</li>
            <li>Supports multiple programming languages</li>
          </ul>
          <p>
            By leveraging CodeBERT, our system can understand the intended functionality of code segments, enabling it to detect similar code even when the implementation details differ significantly.
          </p>
        </>
      )
    },
    detection: {
      title: "Advanced Similarity Detection",
      content: (
        <>
          <p className="mb-4">
            Our similarity detection system combines multiple approaches for comprehensive analysis:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Multi-level comparison (tokens, structure, semantics)</li>
            <li>Weighted similarity scoring</li>
            <li>Pattern recognition for common code structures</li>
            <li>Machine learning-based similarity assessment</li>
          </ul>
          <p>
            The system provides detailed similarity reports with confidence scores, helping identify potential code duplicates or plagiarism with high accuracy.
          </p>
        </>
      )
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full backdrop-blur-md bg-white/70 shadow-lg z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className={`bg-blue-600 p-2 rounded-lg transition-all duration-300 transform ${
                  isLogoHovered ? 'rotate-180 scale-110' : ''
                }`}
                onMouseEnter={() => setIsLogoHovered(true)}
                onMouseLeave={() => setIsLogoHovered(false)}
              >
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Plagiarism Detector</span>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
            <div className={`${
              isMenuOpen 
                ? 'absolute top-full left-0 right-0 bg-white/70 backdrop-blur-md shadow-lg p-4 md:p-0 md:shadow-none'
                : 'hidden'
              } md:block md:static`}
            >
              <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
                <NavLink href="#home">Home</NavLink>
                <NavLink href="#about">About</NavLink>
                <NavLink href="#analyze">Analyze</NavLink>
                <NavLink href="#team">Team</NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="bg-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 transform rotate-12 hover:rotate-45 transition-all duration-300 hover:scale-110">
              <Code2 className="h-8 w-8" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
              Plagiarism Detector
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Advanced plagiarism detection using ASTs and CodeBERT technology
            </p>
            <a
              href="#analyze"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Analysis
              <ChevronDown className="ml-2 h-5 w-5 animate-bounce" />
            </a>
          </div>
        </div>
      </section>

      {/* Project Description */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileCode2 className="h-8 w-8 text-blue-600" />}
              title="AST-based Tokenization"
              description="Convert source code into Abstract Syntax Trees for structural analysis"
              onClick={() => setActiveModal('ast')}
            />
            <FeatureCard
              icon={<Code2 className="h-8 w-8 text-blue-600" />}
              title="Semantic Analysis"
              description="Leverage CodeBERT for deep understanding of code semantics"
              onClick={() => setActiveModal('semantic')}
            />
            <FeatureCard
              icon={<AlertCircle className="h-8 w-8 text-blue-600" />}
              title="Similarity Detection"
              description="Advanced algorithms to detect and quantify code similarities"
              onClick={() => setActiveModal('detection')}
            />
          </div>
        </div>
      </section>

      {/* Code Analysis Section */}
      <section id="analyze" className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Analyze Code</h2>
          <div className="max-w-4xl mx-auto">
            <CodeEditor />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Meet the Team</h2>
          <p className="text-center text-gray-600 mb-16">VIT Pune, SY-CS-A</p>
          <div className="grid md:grid-cols-4 gap-8">
            <TeamMember
              name="Ashish Kumar"
              image="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Blank&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=Blue03&eyeType=Happy&eyebrowType=Default&mouthType=Smile&skinColor=Light"
            />
            <TeamMember
              name="Aryan Jha"
              image="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortRound&accessoriesType=Prescription02&hairColor=Black&facialHairType=BeardLight&facialHairColor=Black&clotheType=BlazerShirt&clotheColor=Gray01&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
            />
            <TeamMember
              name="Aryaa Sharma"
              image="https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&clotheColor=PastelBlue&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light"
            />
            <TeamMember
              name="Baladitya Khantwal"
              image="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortWaved&accessoriesType=Round&hairColor=Black&facialHairType=Blank&clotheType=CollarSweater&clotheColor=Gray01&eyeType=Happy&eyebrowType=Default&mouthType=Smile&skinColor=Light"
            />
          </div>
          <div className="text-center mt-16">
            <div className="inline-flex items-center justify-center space-x-2 text-gray-600 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-xl shadow-sm">
              <School className="h-5 w-5" />
              <span>Data Structures Course Project</span>
            </div>
            <p className="text-gray-600 mt-4">Vishwakarma Institute of Technology, Pune</p>
          </div>
        </div>
      </section>

      {/* Modals */}
      {Object.entries(features).map(([key, feature]) => (
        <Modal
          key={key}
          isOpen={activeModal === key}
          onClose={() => setActiveModal(null)}
          title={feature.title}
        >
          {feature.content}
        </Modal>
      ))}
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
    >
      {children}
    </a>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description,
  onClick
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  onClick: () => void;
}) {
  return (
    <div 
      className="p-8 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <div className="mb-6 bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default App;