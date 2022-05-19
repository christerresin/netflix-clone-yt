import { DocumentData } from '@firebase/firestore-types'
import { CheckIcon } from '@heroicons/react/outline'
import { Plan } from '../typings'

type Props = {
  plans: DocumentData
  selectedPlan: DocumentData | null
}

function Table({ plans, selectedPlan }: Props) {
  return (
    <table>
      <tbody className="divide-y divide-[gray]">
        <tr className="tableRow">
          <td className="tableDataTitle">Monthly price</td>
          {plans?.map((plan: Plan) => (
            <td
              className={`tableDataFeature ${
                selectedPlan?.name === plan.name
                  ? 'text-[#e50914]'
                  : 'text-[gray]'
              }`}
              key={plan.name}
            >
              {plan.price}
            </td>
          ))}
          <td></td>
        </tr>

        <tr className="tableRow">
          <td className="tableDataTitle">Video Quality</td>
          {plans?.map((plan: Plan) => (
            <td
              className={`tableDataFeature ${
                selectedPlan?.name === plan.name
                  ? 'text-[#e50914]'
                  : 'text-[gray]'
              }`}
              key={plan.name}
            >
              {plan.videoQuality}
            </td>
          ))}
        </tr>

        <tr className="tableRow">
          <td className="tableDataTitle">Resolution</td>
          {plans?.map((plan: Plan) => (
            <td
              className={`tableDataFeature ${
                selectedPlan?.name === plan.name
                  ? 'text-[#e50914]'
                  : 'text-[gray]'
              }`}
              key={plan.name}
            >
              {plan.resolution}
            </td>
          ))}
        </tr>

        <tr className="tableRow">
          <td className="tableDataTitle">
            Watch on your TV, computer, mobile phone and tablet
          </td>
          {plans?.map((plan: Plan) => (
            <td
              className={`tableDataFeature ${
                selectedPlan?.name === plan.name
                  ? 'text-[#e50914]'
                  : 'text-[gray]'
              }`}
              key={plan.name}
            >
              {plan?.portability === true && (
                <CheckIcon className="inline-block h-8 w-8" />
              )}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}

export default Table
