import Image from 'next/image'
import React from 'react'

export const ChatRoomTitle = ({title}) => {
  return (
    <div className="relative flex items-center p-3 border-b border-gray-300">
                <div className="avatar">
                  <div className="w-12 rounded">
                    <Image
                      src="/nftImageSample.png"
                      alt=""
                      width="50"
                      height="50"
                      layout="intrinsic"
                    />
                  </div>
                </div>

                <span className="block ml-2 font-bold text-gray-600">{title}</span>
              </div>
  )
}
