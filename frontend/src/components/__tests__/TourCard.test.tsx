import { render, screen } from '@testing-library/react'
import TourCard from '../TourCard'

describe('TourCard', () => {
  const mockTourData = {
    id: '1',
    title: 'Tour Đông Hưng 1 Ngày',
    slug: 'tour-dong-hung-1-ngay',
    image: '/images/tour1.jpg',
    location: 'Đông Hưng, Trung Quốc',
    duration: '1 ngày',
    price: 780000,
    rating: 4.8,
    reviewCount: 156,
  }

  it('renders tour card with correct information', () => {
    render(<TourCard {...mockTourData} />)

    // Check if tour title is rendered
    expect(screen.getByText('Tour Đông Hưng 1 Ngày')).toBeInTheDocument()

    // Check if location is rendered
    expect(screen.getByText('Đông Hưng, Trung Quốc')).toBeInTheDocument()

    // Check if duration is rendered
    expect(screen.getByText('1 ngày')).toBeInTheDocument()

    // Check if price is rendered
    expect(screen.getByText('780,000')).toBeInTheDocument()

    // Check if rating is rendered
    expect(screen.getByText('4.8')).toBeInTheDocument()
  })

  it('displays discount badge when originalPrice is provided', () => {
    render(
      <TourCard
        {...mockTourData}
        originalPrice={1000000}
      />
    )

    // Discount should be 22% ((1000000 - 780000) / 1000000 * 100)
    expect(screen.getByText(/22%/)).toBeInTheDocument()
  })

  it('displays HOT badge when isHot is true', () => {
    render(<TourCard {...mockTourData} isHot={true} />)

    expect(screen.getByText(/HOT/)).toBeInTheDocument()
  })

  it('renders with horizontal variant', () => {
    const { container } = render(
      <TourCard {...mockTourData} variant="horizontal" />
    )

    // Check if the horizontal layout is applied
    expect(container.querySelector('.flex')).toBeInTheDocument()
  })

  it('has correct link to tour detail page', () => {
    render(<TourCard {...mockTourData} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/tour/tour-dong-hung-1-ngay')
  })
})
