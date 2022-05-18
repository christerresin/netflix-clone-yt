import { DocumentData } from '@firebase/firestore-types'
import { Plan } from '../typings'

type Props = {
  plans: DocumentData
  selectedPlan: DocumentData
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
      </tbody>
    </table>
  )
}

export default Table
