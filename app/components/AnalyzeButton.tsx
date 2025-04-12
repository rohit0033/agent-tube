import { Button } from '@/components/ui/button'
import React from 'react'

function AnalyzeButton() {
    return (
        <div>
            <Button variant="secondary" className="bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700">
                Analyze Video
            </Button>
        </div>
    )
}

export default AnalyzeButton
