import { ellipseMad, getAverageOfPoints } from '../../../components/home/GridModalComponent'

describe('GridModalComponent', () => {
  it('correctly filters the one outlier GPS coordinate', async () => {
    let points = [
      [60.17894, 24.94705], // Ravintola Juttutupa (outlier)
      [60.17804, 24.94971], // Perfektio Oy office
      [60.17777, 24.94978], // S-market Hakaniemi
      [60.17819, 24.94902], // Ravintola Taqueria Lopez y Lopez
      [60.17828, 24.94966]  // Ravintola Story Hakaniemi
    ]

    let { filteredPoints, outliers } = ellipseMad(points, 10)
    let avgPoint = getAverageOfPoints(filteredPoints)

    expect(outliers).toStrictEqual([points[0]]) // Juttutupa should be the outlier
    expect(avgPoint).toStrictEqual([60.17807, 24.9495425])
  })

  it('correctly filters the two outlier GPS coordinates', async () => {
    let points = [
      [60.17894, 24.94705], // Ravintola Juttutupa (outlier)
      [60.17804, 24.94971], // Perfektio Oy office
      [60.17777, 24.94978], // S-market Hakaniemi
      [60.17894, 24.94705], // Ravintola Juttutupa (outlier)
      [60.17828, 24.94966]  // Ravintola Story Hakaniemi
    ]

    let { filteredPoints, outliers } = ellipseMad(points, 10)
    let avgPoint = getAverageOfPoints(filteredPoints)

    expect(outliers).toStrictEqual([points[0], points[3]]) // Juttutupa should be the outlier
    expect(avgPoint[0]).toBe(60.17803)
    expect(avgPoint[1]).toBeCloseTo(24.94971666, 7)
  })

  it('fails to filter out if more than half of the GPS coordinates are wrong :(', async () => {
    let points = [
      [60.17894, 24.94705], // Ravintola Juttutupa (outlier)
      [60.17804, 24.94971], // Perfektio Oy office
      [60.17777, 24.94978], // S-market Hakaniemi
      [60.17893, 24.94704], // Ravintola Juttutupa (outlier)
      [60.17895, 24.94706] // Ravintola Juttutupa (outlier)
    ]

    let { filteredPoints, outliers } = ellipseMad(points, 10)
    let avgPoint = getAverageOfPoints(filteredPoints)

    expect(outliers).toStrictEqual([points[1], points[2]]) // Juttutupa should be the outlier
    expect(avgPoint[0]).toBeCloseTo(60.17894, 7)
    expect(avgPoint[1]).toBeCloseTo(24.94705, 7)
  })
})