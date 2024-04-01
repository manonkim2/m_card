import BasicInfo from './BasicInfo'
import CardInfo from './CardInfo'
import Terms from './Terms'

interface ApplyProps {
  step: number
  onSubmit: () => void
}

const Apply = ({ step, onSubmit }: ApplyProps) => {
  return (
    <div>
      {step === 0 && <Terms />}
      {step === 1 && <BasicInfo />}
      {step === 2 && <CardInfo />}
    </div>
  )
}

export default Apply