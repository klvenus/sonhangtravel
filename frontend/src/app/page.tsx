import HeroSection from '@/components/HeroSection'
import CategorySection from '@/components/CategorySection'
import FeaturedTours from '@/components/FeaturedTours'
import CategoryTours from '@/components/CategoryTours'
import WhyChooseUs from '@/components/WhyChooseUs'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CategorySection />
      <FeaturedTours />
      <CategoryTours />
      <WhyChooseUs />
    </main>
  )
}
