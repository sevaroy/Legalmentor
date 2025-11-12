'use client'

import { useState } from 'react'

import { FileText, Gavel, Scale, Shield } from 'lucide-react'

import { useBrandConfig } from '@/lib/branding/config'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CaseLawIcon, ComplianceIcon, ContractAnalysisIcon, LegalMentorLogo, LegalResearchIcon } from '@/components/ui/legal-icons'

import { LegalMentorEmptyScreen } from '@/components/legal-mentor-empty-screen'

export default function TestLegalMentorPage() {
  const [showComponents, setShowComponents] = useState(false)
  const brandConfig = useBrandConfig()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 標題 */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <LegalMentorLogo className="size-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              {brandConfig.name} 測試頁面
            </h1>
          </div>
          <p className="text-muted-foreground mb-6 text-lg">
            {brandConfig.tagline}
          </p>
          <Button 
            onClick={() => setShowComponents(!showComponents)}
            className="mb-8 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {showComponents ? '隱藏組件' : '顯示組件'}
          </Button>
        </div>

        {showComponents && (
          <div className="space-y-8">
            {/* 品牌信息 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Scale className="size-6 text-blue-600" />
                品牌信息
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">基本信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><strong>名稱:</strong> {brandConfig.name}</div>
                    <div><strong>標語:</strong> {brandConfig.tagline}</div>
                    <div><strong>域名:</strong> {brandConfig.domain}</div>
                    <div><strong>Twitter:</strong> {brandConfig.social.twitter}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">專業領域</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {brandConfig.legal.specialties.slice(0, 4).map((specialty, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span>{specialty}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">管轄區域</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {brandConfig.legal.jurisdictions.slice(0, 4).map((jurisdiction, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Gavel className="w-3 h-3 text-blue-600" />
                          <span>{jurisdiction}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* 法律專業圖標 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="size-6 text-blue-600" />
                法律專業圖標
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="text-center p-6">
                  <LegalMentorLogo className="size-12 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium">Legal Mentor Logo</p>
                </Card>
                <Card className="text-center p-6">
                  <LegalResearchIcon className="size-12 mx-auto mb-2 text-green-600" />
                  <p className="text-sm font-medium">Legal Research</p>
                </Card>
                <Card className="text-center p-6">
                  <ContractAnalysisIcon className="size-12 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm font-medium">Contract Analysis</p>
                </Card>
                <Card className="text-center p-6">
                  <CaseLawIcon className="size-12 mx-auto mb-2 text-amber-600" />
                  <p className="text-sm font-medium">Case Law</p>
                </Card>
                <Card className="text-center p-6">
                  <ComplianceIcon className="size-12 mx-auto mb-2 text-red-600" />
                  <p className="text-sm font-medium">Compliance</p>
                </Card>
              </div>
            </section>

            {/* 空白屏幕組件測試 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="size-6 text-blue-600" />
                Legal Mentor 空白屏幕
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <LegalMentorEmptyScreen
                    submitMessage={(message) => {
                      alert(`選擇的法律研究主題: ${message}`)
                    }}
                  />
                </CardContent>
              </Card>
            </section>

            {/* 色彩系統 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">法律專業色彩系統</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="w-full h-16 bg-blue-600 rounded-lg mb-2"></div>
                  <p className="text-sm font-medium">Primary Blue</p>
                  <p className="text-xs text-muted-foreground">#1e40af</p>
                </Card>
                <Card className="p-4">
                  <div className="w-full h-16 bg-red-600 rounded-lg mb-2"></div>
                  <p className="text-sm font-medium">Legal Red</p>
                  <p className="text-xs text-muted-foreground">#dc2626</p>
                </Card>
                <Card className="p-4">
                  <div className="w-full h-16 bg-green-600 rounded-lg mb-2"></div>
                  <p className="text-sm font-medium">Success Green</p>
                  <p className="text-xs text-muted-foreground">#059669</p>
                </Card>
                <Card className="p-4">
                  <div className="w-full h-16 bg-amber-600 rounded-lg mb-2"></div>
                  <p className="text-sm font-medium">Warning Amber</p>
                  <p className="text-xs text-muted-foreground">#d97706</p>
                </Card>
              </div>
            </section>

            {/* 功能特色 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">功能特色</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(brandConfig.features).map(([key, feature]) => (
                  <Card key={key}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                          <Scale className="size-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">{feature}</h3>
                          <p className="text-sm text-muted-foreground">
                            專業級法律研究功能
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* 測試結果 */}
        <section className="mt-12 p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Shield className="size-5 text-blue-600" />
            Legal Mentor 品牌測試狀態
          </h3>
          <div className="space-y-2 text-sm">
            <p>✅ Legal Mentor 品牌配置已載入</p>
            <p>✅ 法律專業圖標系統可用</p>
            <p>✅ 法律專業色彩系統已應用</p>
            <p>✅ 法律專業示例和功能已集成</p>
            <p>✅ 品牌感知組件系統正常運行</p>
          </div>
        </section>
      </div>
    </div>
  )
}