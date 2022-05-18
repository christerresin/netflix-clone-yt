import { DocumentData } from '@firebase/firestore-types'
import { Plan } from '../typings'

function Table({ plans }: DocumentData) {
  return (
    <table>
      <tbody className="divide-y divide-[gray]">
        <tr className="tableRow">
          <td className="tableDataTitle">Monthly price</td>
          {plans?.map((plan: Plan) => (
            <td className="tableDataFeature" key={plan.name}>
              {plan.price}
            </td>
          ))}
          <td></td>
        </tr>
        <tr className="tableRow">
          <td className="tableDataTitle">Video Quality</td>
          {plans?.map((plan: Plan) => (
            <td className="tableDataFeature" key={plan.name}>
              {plan.videoQuality}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}

export default Table
