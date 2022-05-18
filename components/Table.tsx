import { DocumentData } from '@firebase/firestore-types'
import { Plan } from '../typings'

function Table({ plans }: DocumentData) {
  return (
    <table>
      <tbody>
        <tr className="tableRow">
          <td className="tableDataTitle">Monthly price</td>
          {plans?.map((plan: Plan) => (
            <td className="tableDataFeature" key={plan.name}>
              {plan.price}
            </td>
          ))}
          <td></td>
        </tr>
      </tbody>
    </table>
  )
}

export default Table
