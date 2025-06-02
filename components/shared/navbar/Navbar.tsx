"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import SiteLogo from "../siteLogo"

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)

    return (
        <nav className="border-b">
            <div className="mx-auto flex my-container items-center justify-between py-4">
                <div className="flex items-center">
                    <SiteLogo />
                </div>

                {/* Desktop navigation */}
                <div className="hidden space-x-1 md:flex">
                    <Button variant="ghost" asChild>
                        <Link href="/">Home</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="/about">About</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="/services">Services</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="/contact">Contact</Link>
                    </Button>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/" onClick={() => setIsMenuOpen(false)}>
                                Home
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                                About
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/services" onClick={() => setIsMenuOpen(false)}>
                                Services
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                                Contact
                            </Link>
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    )
}
