import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCallback } from 'react'

import FixedBottomButton from '@/components/shared/FixedBottomButton'
import ListRow from '@/components/shared/ListRow'
import Top from '@/components/shared/Top'
import { getCard } from '@/remote/card'
import useUser from '@/hooks/auth/useUser'
import { useAlertContext } from '@/contexts/AlertContext'
import Review from '@/components/card/Review'

const CardPage = () => {
  const { id = '' } = useParams()
  const user = useUser()
  const { open } = useAlertContext()
  const navigate = useNavigate()

  const { data } = useQuery(['card', id], () => getCard(id), {
    enabled: id !== '',
  })

  const moveToApply = useCallback(() => {
    if (!user) {
      open({
        title: '로그인 부탁드립니다.',
        onButtonClick: () => {
          navigate('/signin')
        },
      })
      return
    }

    navigate(`/apply/${id}`)
  }, [id, navigate, open, user])

  if (data == null) {
    return null
  }
  const { name, corpName, benefit, tags, promotion } = data

  const subTitle =
    promotion != null ? removeHtmlTags(promotion?.title) : tags.join(', ')

  return (
    <div>
      <Top title={`${corpName} ${name}`} subTitle={subTitle} />

      <ul>
        {benefit.map((text, index) => (
          <motion.li
            key={index}
            initial={{
              opacity: 0,
              translateX: -90,
            }}
            transition={{
              duration: 0.9,
              ease: 'easeInOut',
              delay: index * 0.1,
            }}
            animate={{
              opacity: 1,
              translateX: 0,
            }}
          >
            <ListRow
              as={'div'}
              key={index}
              left={<IconCheck />}
              contents={
                <ListRow.Texts title={`혜택 ${index + 1}`} subTitle={text} />
              }
            />
          </motion.li>
        ))}
      </ul>

      <div style={{ paddingTop: 1000 }} />
      <Review />
      <div style={{ paddingBottom: 100 }} />

      <FixedBottomButton label="신청하기" onClick={moveToApply} />
    </div>
  )
}

const IconCheck = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
    >
      <path
        d="M14.72,8.79l-4.29,4.3L8.78,11.44a1,1,0,1,0-1.41,1.41l2.35,2.36a1,1,0,0,0,.71.29,1,1,0,0,0,.7-.29l5-5a1,1,0,0,0,0-1.42A1,1,0,0,0,14.72,8.79ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
        fill="#6563ff"
      />
    </svg>
  )
}

const removeHtmlTags = (text: string) => {
  return text.replace(/<\/?[^>]+(>|$)/g, '')
}

export default CardPage
