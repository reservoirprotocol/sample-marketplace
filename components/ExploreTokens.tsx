import { paths } from 'interfaces/apiTypes'
import formatUrl from 'lib/formatUrl'
import { formatBN, formatNumber } from 'lib/numbers'
import { optimizeImage } from 'lib/optmizeImage'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SWRInfiniteResponse } from 'swr/infinite/dist/infinite'
import ClearFilters from './ClearFilters'

type Props = {
  viewRef: (node?: Element | null | undefined) => void
  attributes: SWRInfiniteResponse<
    paths['/collections/{collection}/attributes']['get']['responses']['200']['schema'],
    any
  >
}

const ExploreTokens = ({ viewRef, attributes }: Props) => {
  const router = useRouter()

  const { data, isValidating, size } = attributes

  const mappedAttributes = data
    ? data.map(({ attributes }) => attributes).flat()
    : []
  const isEmpty = mappedAttributes.length === 0
  const isReachingEnd =
    isEmpty || (data && data && data[data.length - 1]?.attributes?.length === 0)

  if (!isEmpty) {
    return (
      <table className="mb-6 w-full table-auto">
        <thead>
          <tr className="text-left">
            <th className="pl-3">Key</th>
            <th className="pr-3">Value</th>
            <th className="pr-3">Count</th>
            <th className="whitespace-nowrap pr-3">On Sale</th>
            <th className="whitespace-nowrap pr-3">Floor Price</th>
            <th className="whitespace-nowrap pr-3">Top Offer</th>
            <th className="pr-3">Samples</th>
          </tr>
        </thead>
        <tbody>
          {mappedAttributes.map((attribute, index, arr) => (
            <tr
              key={`${attribute?.value}-${index}`}
              ref={index === arr.length - 5 ? viewRef : undefined}
              className="group even:bg-[#fefbff] dark:even:bg-neutral-900"
            >
              <td className="pl-3 pr-3">{attribute?.key}</td>
              <td className="h-px pr-3">
                <Link
                  href={`/collections/${router.query.id}?${formatUrl(
                    `attributes[${attribute?.key}]`
                  )}=${formatUrl(`${attribute?.value}`)}`}
                >
                  <a className="grid h-full items-center p-2 align-middle font-bold tracking-wide">
                    {attribute?.value}
                  </a>
                </Link>
              </td>
              <td className="pr-3">{formatNumber(attribute?.tokenCount)}</td>
              <td className="pr-3">{formatNumber(attribute?.onSaleCount)}</td>
              <td className="pr-3">
                {formatBN(attribute?.floorSellValues?.[0], 2)}
              </td>
              <td className="pr-3">{formatBN(attribute?.topBuy?.value, 2)}</td>
              <td className="w-[230px] pr-3">
                <Link
                  href={`/collections/${router.query.id}?${formatUrl(
                    `attributes[${attribute?.key}]`
                  )}=${formatUrl(`${attribute?.value}`)}`}
                >
                  <a>
                    <ExploreImages
                      sample_images={attribute?.sampleImages}
                      value={attribute?.value}
                    />
                  </a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return <ClearFilters router={router} />
}

export default ExploreTokens

const LoadingCard = ({
  viewRef,
}: {
  viewRef?: (node?: Element | null | undefined) => void
}) => (
  <div
    ref={viewRef}
    className="grid h-[290px] animate-pulse rounded-md border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-black"
  >
    <div className="mt-auto p-3">
      <div className="aspect-w-1 aspect-h-1 relative">
        <div className="mb-3 h-full bg-neutral-200 dark:bg-neutral-800"></div>
      </div>
      <div className="flex items-center justify-between py-2">
        <div className="h-5 w-[100px] rounded-md bg-neutral-200 dark:bg-neutral-800"></div>
        <div className="h-5 w-[40px] rounded-md bg-neutral-200 dark:bg-neutral-800"></div>
      </div>
      <div className="flex items-center justify-between py-2">
        <div className="space-y-2">
          <div className="h-3 w-[50px] rounded-md bg-neutral-200 dark:bg-neutral-800"></div>
          <div className="h-3 w-[50px] rounded-md bg-neutral-200 dark:bg-neutral-800"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-[50px] rounded-md bg-neutral-200 dark:bg-neutral-800"></div>
          <div className="h-3 w-[50px] rounded-md bg-neutral-200 dark:bg-neutral-800"></div>
        </div>
      </div>
    </div>
  </div>
)

const ExploreImages = ({
  sample_images,
  value,
}: {
  sample_images: NonNullable<
    paths['/collections/{collection}/attributes']['get']['responses']['200']['schema']['attributes']
  >[0]['sampleImages']
  value: NonNullable<
    paths['/collections/{collection}/attributes']['get']['responses']['200']['schema']['attributes']
  >[0]['value']
}) => (
  <div className="flex justify-start gap-1.5 py-1">
    {sample_images && sample_images?.length > 0 ? (
      // SMALLER IMAGE, HAS SIDE IMAGES
      sample_images.map((image) => (
        <img
          key={image}
          src={optimizeImage(image, 50)}
          alt={`${value}`}
          width="50"
          height="50"
        />
      ))
    ) : (
      <img
        src="https://via.placeholder.com/50"
        alt={`${value}`}
        width="50"
        height="50"
      />
    )}
  </div>
)