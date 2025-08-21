'use client'

import { useState } from 'react'
import { BarChart3, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Typography'
import { Flex } from '@/components/ui/Layout'

interface PollOption {
  id: string
  text: string
  votes: number
}

interface Poll {
  id: string
  question: string
  options: PollOption[]
  totalVotes: number
  userVote?: string
  createdBy: string
  createdAt: string
}

interface QuickPollProps {
  poll: Poll
  onVote: (pollId: string, optionId: string) => void
  currentUserId?: string
}

export const QuickPoll = ({ poll, onVote, currentUserId }: QuickPollProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(poll.userVote || null)
  const [hasVoted, setHasVoted] = useState(!!poll.userVote)

  const handleVote = (optionId: string) => {
    if (hasVoted || !currentUserId) return
    
    setSelectedOption(optionId)
    setHasVoted(true)
    onVote(poll.id, optionId)
  }

  const getPercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0
    return Math.round((votes / poll.totalVotes) * 100)
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 my-3">
      {/* Poll Header */}
      <Flex align="center" gap="sm" className="mb-3">
        <BarChart3 size={18} className="text-green-600" />
        <Text variant="body2" className="font-semibold text-gray-900">
          {poll.question}
        </Text>
      </Flex>

      {/* Poll Options */}
      <div className="space-y-2 mb-3">
        {poll.options.map((option) => {
          const percentage = getPercentage(option.votes)
          const isSelected = selectedOption === option.id
          const isWinning = hasVoted && option.votes === Math.max(...poll.options.map(o => o.votes))

          return (
            <div key={option.id} className="relative">
              <Button
                variant="ghost"
                className={`
                  w-full justify-start p-3 h-auto relative overflow-hidden transition-all duration-200
                  ${hasVoted 
                    ? 'cursor-default' 
                    : 'hover:bg-white hover:shadow-sm cursor-pointer'
                  }
                  ${isSelected 
                    ? 'bg-green-100 border-green-300 text-green-800' 
                    : 'bg-white border-gray-200'
                  }
                  ${isWinning && hasVoted 
                    ? 'ring-2 ring-green-300' 
                    : ''
                  }
                `}
                onClick={() => handleVote(option.id)}
                disabled={hasVoted}
              >
                {/* Progress Bar Background */}
                {hasVoted && (
                  <div 
                    className={`
                      absolute left-0 top-0 h-full transition-all duration-500 ease-out
                      ${isSelected 
                        ? 'bg-green-200' 
                        : 'bg-gray-100'
                      }
                    `}
                    style={{ width: `${percentage}%` }}
                  />
                )}

                {/* Option Content */}
                <Flex justify="between" align="center" className="relative z-10 w-full">
                  <Flex align="center" gap="sm">
                    {isSelected && hasVoted && (
                      <Check size={16} className="text-green-600" />
                    )}
                    <Text 
                      variant="body2" 
                      className={isSelected ? 'font-medium' : ''}
                    >
                      {option.text}
                    </Text>
                  </Flex>

                  {hasVoted && (
                    <Flex align="center" gap="sm">
                      <Text variant="caption" className="text-gray-600">
                        {option.votes} votes
                      </Text>
                      <Text variant="caption" className="font-semibold text-gray-800">
                        {percentage}%
                      </Text>
                    </Flex>
                  )}
                </Flex>
              </Button>
            </div>
          )
        })}
      </div>

      {/* Poll Footer */}
      <Flex justify="between" align="center" className="text-sm text-gray-600">
        <Text variant="caption">
          {poll.totalVotes} total votes
        </Text>
        <Text variant="caption">
          by {poll.createdBy} • {new Date(poll.createdAt).toLocaleDateString()}
        </Text>
      </Flex>

      {/* Voting Status */}
      {!currentUserId && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-center">
          <Text variant="caption" className="text-yellow-800">
            Log in to vote in this poll
          </Text>
        </div>
      )}
    </div>
  )
}

// Poll Creation Modal Component
interface CreatePollModalProps {
  isOpen: boolean
  onClose: () => void
  onCreatePoll: (question: string, options: string[]) => void
}

export const CreatePollModal = ({ isOpen, onClose, onCreatePoll }: CreatePollModalProps) => {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validOptions = options.filter(opt => opt.trim().length > 0)
    
    if (question.trim() && validOptions.length >= 2) {
      onCreatePoll(question.trim(), validOptions)
      setQuestion('')
      setOptions(['', ''])
      onClose()
    }
  }

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, ''])
    }
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <Flex justify="between" align="center" className="mb-4">
          <Text variant="h3" className="font-semibold">
            Create Quick Poll
          </Text>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={18} />
          </Button>
        </Flex>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question Input */}
          <div>
            <Text variant="body2" className="font-medium mb-2">
              Poll Question
            </Text>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to ask?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Options */}
          <div>
            <Text variant="body2" className="font-medium mb-2">
              Options
            </Text>
            <div className="space-y-2">
              {options.map((option, index) => (
                <Flex key={index} gap="sm" align="center">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </Flex>
              ))}
            </div>
            
            {options.length < 4 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addOption}
                className="mt-2 text-blue-600 hover:text-blue-700"
              >
                + Add Option
              </Button>
            )}
          </div>

          {/* Submit */}
          <Flex gap="sm" justify="end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Poll
            </Button>
          </Flex>
        </form>
      </div>
    </div>
  )
}
