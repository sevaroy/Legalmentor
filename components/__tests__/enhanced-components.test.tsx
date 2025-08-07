/**
 * 增強組件測試套件
 * 確保新組件功能完整性和性能表現
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { EnhancedAppSidebar } from '../enhanced-app-sidebar'
import { EnhancedChatPanel } from '../enhanced-chat-panel'
import { EnhancedEmptyScreen } from '../enhanced-empty-screen'

// Mock dependencies
jest.mock('../artifact/artifact-context', () => ({
  useArtifact: () => ({ close: jest.fn() })
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() })
}))

describe('Enhanced Components', () => {
  describe('EnhancedChatPanel', () => {
    const defaultProps = {
      input: '',
      handleInputChange: jest.fn(),
      handleSubmit: jest.fn(),
      isLoading: false,
      messages: [],
      setMessages: jest.fn(),
      stop: jest.fn(),
      append: jest.fn(),
      models: [],
      showScrollToBottomButton: false,
      scrollContainerRef: { current: null }
    }

    it('renders without crashing', () => {
      render(<EnhancedChatPanel {...defaultProps} />)
      expect(screen.getByPlaceholderText('Ask a question...')).toBeInTheDocument()
    })

    it('shows enhanced UI elements when focused', async () => {
      render(<EnhancedChatPanel {...defaultProps} />)
      const textarea = screen.getByPlaceholderText('Ask a question...')
      
      fireEvent.focus(textarea)
      
      await waitFor(() => {
        expect(screen.getByText(/Tip: Press Enter to send/)).toBeInTheDocument()
      })
    })

    it('displays character count when typing', async () => {
      const handleInputChange = jest.fn()
      render(<EnhancedChatPanel {...defaultProps} handleInputChange={handleInputChange} input="test" />)
      
      await waitFor(() => {
        expect(screen.getByText('4 chars')).toBeInTheDocument()
      })
    })
  })

  describe('EnhancedEmptyScreen', () => {
    const submitMessage = jest.fn()

    it('renders example messages with categories', () => {
      render(<EnhancedEmptyScreen submitMessage={submitMessage} />)
      
      expect(screen.getByText('Try these examples')).toBeInTheDocument()
      expect(screen.getByText('AI & Tech')).toBeInTheDocument()
      expect(screen.getByText('Business')).toBeInTheDocument()
    })

    it('calls submitMessage when example is clicked', () => {
      render(<EnhancedEmptyScreen submitMessage={submitMessage} />)
      
      const exampleButton = screen.getByText('What is DeepSeek R1?')
      fireEvent.click(exampleButton)
      
      expect(submitMessage).toHaveBeenCalledWith('What is DeepSeek R1?')
    })
  })

  describe('EnhancedAppSidebar', () => {
    it('renders enhanced branding', () => {
      render(<EnhancedAppSidebar />)
      
      expect(screen.getByText('Morphic')).toBeInTheDocument()
      expect(screen.getByText('AI Search Engine')).toBeInTheDocument()
    })

    it('shows quick actions section', () => {
      render(<EnhancedAppSidebar />)
      
      expect(screen.getByText('Quick Actions')).toBeInTheDocument()
      expect(screen.getByText('Recent Searches')).toBeInTheDocument()
      expect(screen.getByText('Preferences')).toBeInTheDocument()
    })

    it('displays online status', () => {
      render(<EnhancedAppSidebar />)
      
      expect(screen.getByText('Online')).toBeInTheDocument()
    })
  })
})

// 性能測試
describe('Performance Tests', () => {
  it('enhanced components render within acceptable time', async () => {
    const startTime = performance.now()
    
    render(<EnhancedEmptyScreen submitMessage={jest.fn()} />)
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    // 應該在 100ms 內完成渲染
    expect(renderTime).toBeLessThan(100)
  })
})

// 無障礙性測試
describe('Accessibility Tests', () => {
  it('enhanced components have proper ARIA labels', () => {
    render(<EnhancedChatPanel {...{
      input: '',
      handleInputChange: jest.fn(),
      handleSubmit: jest.fn(),
      isLoading: false,
      messages: [],
      setMessages: jest.fn(),
      stop: jest.fn(),
      append: jest.fn(),
      models: [],
      showScrollToBottomButton: false,
      scrollContainerRef: { current: null }
    }} />)
    
    const textarea = screen.getByPlaceholderText('Ask a question...')
    expect(textarea).toHaveAttribute('tabIndex', '0')
  })
})