import Icon from "@/components/ui/AppIcon";
import { SignedIn } from "@/services/clerk/components/SignInStatus";

const CTASection = () => {
    return (
        <section className="py-20 lg:py-32 bg-gradient-to-br from-primary via-secondary to-primary relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-full border border-white/30 mb-8">
                        <Icon
                            name="RocketLaunchIcon"
                            size={16}
                            className="text-white"
                            variant="solid"
                        />
                        <span className="text-sm font-medium text-white font-body">
                            Start Your Job Search Today
                        </span>
                    </div>

                    <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 font-headline">
                        Ready to Never Write a Cover Letter Again?
                    </h2>

                    <p className="text-lg lg:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-body">
                        Join thousands of job seekers who've transformed their
                        application process. Generate your first cover letter in
                        10 seconds.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <SignedIn>
                            <button className="px-10 py-5 bg-white text-primary rounded-lg font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 font-cta inline-flex items-center space-x-2">
                                <span>Login</span>
                                <Icon
                                    name="ArrowRightIcon"
                                    size={20}
                                    variant="solid"
                                />
                            </button>
                        </SignedIn>
                        <button
                            className="px-10 py-5 bg-transparent text-white border-2 border-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-200 font-cta"
                            onClick={(e) => {
                                e.preventDefault();
                                document
                                    .getElementById("pricing")
                                    ?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            View Pricing
                        </button>
                    </div>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/90">
                        <div className="flex items-center space-x-2">
                            <Icon
                                name="CheckCircleIcon"
                                size={20}
                                variant="solid"
                            />
                            <span className="text-sm font-body">
                                The price of 2 cups of coffee
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Icon
                                name="CheckCircleIcon"
                                size={20}
                                variant="solid"
                            />
                            <span className="text-sm font-body">
                                2 free cover letters
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Icon
                                name="CheckCircleIcon"
                                size={20}
                                variant="solid"
                            />
                            <span className="text-sm font-body">
                                Use our advanced AI generator
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
