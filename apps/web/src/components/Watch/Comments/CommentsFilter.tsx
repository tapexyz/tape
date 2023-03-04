import SortOutline from '@components/Common/Icons/SortOutline'
import DropMenu from '@components/UIElements/DropMenu'
import Tooltip from '@components/UIElements/Tooltip'
import { Menu } from '@headlessui/react'
import clsx from 'clsx'
import { CommentOrderingTypes, CommentRankingFilter } from 'lens'
import type { FC } from 'react'
import React from 'react'
import type { CommentsFilterType } from 'utils'

type Props = {
  rankingFilter: CommentsFilterType
  onSort: (filter: CommentsFilterType) => void
}

const CommentsFilter: FC<Props> = ({ rankingFilter, onSort }) => {
  return (
    <DropMenu
      trigger={
        <Tooltip content="Sort by" placement="top">
          <span>
            <SortOutline className="h-5 w-5" />
          </span>
        </Tooltip>
      }
    >
      <div className="bg-secondary mt-1 overflow-hidden rounded-xl border border-gray-200 p-1 text-sm shadow dark:border-gray-800">
        <Menu.Item
          className={clsx(
            'w-full rounded-lg px-3 py-1.5 text-left',
            rankingFilter.commentsRankingFilter ===
              CommentRankingFilter.Relevant && 'bg-gray-100 dark:bg-gray-800'
          )}
          onClick={() =>
            onSort({ commentsRankingFilter: CommentRankingFilter.Relevant })
          }
          as="button"
        >
          <span className="whitespace-nowrap">Relevant</span>
        </Menu.Item>
        <Menu.Item
          className={clsx(
            'w-full rounded-lg px-3 py-1.5 text-left',
            rankingFilter.commentsOfOrdering === CommentOrderingTypes.Desc &&
              'bg-gray-100 dark:bg-gray-800'
          )}
          onClick={() =>
            onSort({ commentsOfOrdering: CommentOrderingTypes.Desc })
          }
          as="button"
        >
          <span className="whitespace-nowrap">Newest first</span>
        </Menu.Item>
      </div>
    </DropMenu>
  )
}

export default CommentsFilter
