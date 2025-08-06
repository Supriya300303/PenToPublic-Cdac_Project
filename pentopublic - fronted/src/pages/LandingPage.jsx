import React from 'react'; // Removed useState and useEffect as theme logic is now in Layout
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, PenTool, Star, ArrowRight, Check } from 'lucide-react'; // Removed Sun and Moon icons

const LandingPage = () => {
  const navigate = useNavigate();
  const currentUserId = 1; // Replace with actual user ID from auth context or Redux

  // Removed theme state and useEffect hooks as theme is managed by Layout
  // Removed toggleTheme function as it's managed by Layout

  const handlePlanSelect = (planType) => {
    navigate("/subscription", {
      state: {
        selectedPlan: planType,
        userId: currentUserId,
        fromRegister: false,
      }
    });
  };

  const features = [
    {
      icon: BookOpen,
      title: "Discover Amazing Stories",
      description: "Explore thousands of books from talented authors worldwide"
    },
    {
      icon: PenTool,
      title: "Publish Your Work",
      description: "Share your stories with readers who appreciate great literature"
    },
    {
      icon: Users,
      title: "Join Our Community",
      description: "Connect with fellow readers and authors in our vibrant community"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Published Author",
      content: "PenToPublic gave me the platform to reach thousands of readers. It's been an incredible journey!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Avid Reader",
      content: "I've discovered so many amazing stories here. The quality of content is outstanding!",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "New Author",
      content: "The community support and feedback helped me improve my writing tremendously.",
      rating: 5
    }
  ];

  const plans = [
    {
      name: "Reader",
      price: "Free",
      planType: "reader",
      features: [
        "Access to free books",
        "Basic community features",
        "Reading progress tracking",
        "Book recommendations"
      ]
    },
    {
      name: "Premium Reader",
      price: "$9.99/month",
      planType: "monthly",
      features: [
        "Access to all premium content",
        "Early access to new releases",
        "Ad-free reading experience",
        "Exclusive author interviews",
        "Advanced reading analytics"
      ],
      popular: true
    },
    {
      name: "Author",
      price: "Free",
      planType: "author",
      features: [
        "Publish unlimited books",
        "Author analytics dashboard",
        "Reader engagement tools",
        "Community access"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-off-white-light text-brown-dark dark:bg-brown-dark dark:text-off-white">
      {/* Removed the Header section from here as it's now handled by Layout.jsx */}

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-brown-dark dark:text-off-white mb-8">
            From{" "}
            <span className="bg-gradient-to-r from-brown-600 via-brown-700 to-brown-800 bg-clip-text text-transparent">
              Pen to Public
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-brown-mid dark:text-off-white-dark mb-12 max-w-3xl mx-auto leading-relaxed">
            The ultimate platform where authors share their stories and readers discover their next favorite book.
            Join thousands of writers and readers in our vibrant literary community.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-gradient-to-r from-brown-500 to-brown-600 text-white text-lg font-semibold rounded-2xl hover:from-brown-600 hover:to-brown-700 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-off-white-light/80 dark:bg-brown-dark/80 backdrop-blur-sm text-brown-dark dark:text-off-white text-lg font-semibold rounded-2xl hover:bg-off-white dark:hover:bg-brown-dark transition-all duration-200 shadow-xl hover:shadow-2xl border border-off-white dark:border-brown-light"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-off-white dark:bg-brown-mid backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-brown-dark dark:text-off-white mb-16">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-brown-600 to-brown-700 bg-clip-text text-transparent">
              PenToPublic?
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-off-white-light dark:bg-brown-dark rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-brown-500 to-brown-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-brown-dark dark:text-off-white mb-4">{feature.title}</h3>
                <p className="text-brown-mid dark:text-off-white-dark text-lg leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-brown-dark dark:text-off-white mb-16">
            What Our{" "}
            <span className="bg-gradient-to-r from-brown-600 to-brown-700 bg-clip-text text-transparent">
              Community Says
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-off-white-light/80 dark:bg-brown-dark/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-brown-500 fill-current" />
                  ))}
                </div>
                <p className="text-brown-mid dark:text-off-white-dark text-lg mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-brown-dark dark:text-off-white">{testimonial.name}</p>
                  <p className="text-brown-600 dark:text-brown-400 font-medium">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-off-white dark:bg-brown-mid backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-brown-dark dark:text-off-white mb-16">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-brown-600 to-brown-700 bg-clip-text text-transparent">
              Plan
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`relative bg-off-white-light/80 dark:bg-brown-dark/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ${plan.popular ? 'ring-4 ring-brown-500 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-brown-500 to-brown-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-brown-dark dark:text-off-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-brown-600 dark:text-brown-400 mb-2">{plan.price}</div>
                  {plan.price !== "Free" && <p className="text-brown-mid dark:text-off-white-dark">per month</p>}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-brown-mid dark:text-off-white-dark">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    if (plan.planType === "monthly") {
                      handlePlanSelect("monthly");
                    } else {
                      alert("You’re already on this free plan!");
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-brown-500 to-brown-600 text-white hover:from-brown-600 hover:to-brown-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-brown-100 dark:bg-brown-600 text-brown-dark dark:text-off-white hover:bg-brown-200 dark:hover:bg-brown-500'
                  }`}
                >
                  {plan.planType === "monthly" ? "Change Plan" : "My Plan"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-brown-dark dark:text-off-white mb-8">
            Ready to{" "}
            <span className="bg-gradient-to-r from-brown-600 to-brown-700 bg-clip-text text-transparent">
              Begin Your Story?
            </span>
          </h2>
          <p className="text-xl text-brown-mid dark:text-off-white-dark mb-12 leading-relaxed">
            Join thousands of authors and readers who have already discovered the magic of PenToPublic.
            Your next great adventure in literature starts here.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="px-10 py-4 bg-gradient-to-r from-brown-500 to-brown-600 text-white text-lg font-semibold rounded-2xl hover:from-brown-600 hover:to-brown-700 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:scale-105"
            >
              Join Now - It's Free!
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-10 py-4 bg-off-white-light/80 dark:bg-brown-dark/80 backdrop-blur-sm text-brown-dark dark:text-off-white text-lg font-semibold rounded-2xl hover:bg-off-white dark:hover:bg-brown-dark transition-all duration-200 shadow-xl hover:shadow-2xl border border-off-white dark:border-brown-light"
            >
              Already a Member?
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brown-dark dark:bg-brown-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-brown-500 to-brown-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">PenToPublic ✍️</h3>
          </div>
          <p className="text-brown-200 mb-6">
            Connecting authors and readers through the power of storytelling.
          </p>
          <p className="text-brown-300 text-sm">
            © 2024 PenToPublic. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
