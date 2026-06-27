import asyncio
from playwright.async_api import async_playwright

async def get_claude_session():
    async with async_playwright() as p:
        browser = await p.firefox.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        
        await page.goto('https://claude.ai')
        
        print("\n=== LOGIN TO CLAUDE ===")
        print("Waiting for you to login...")
        print("After login, press Enter here...")
        
        input()
        
        cookies = await context.cookies()
        
        for cookie in cookies:
            if cookie['name'] == 'sessionKey':
                print(f"\n=== SESSION KEY FOUND ===")
                print(f"\n{cookie['value']}\n")
                print("Copy this and paste to .env as CLAUDE_SESSION_KEY")
                break
        else:
            print("\nSession key not found!")
        
        await browser.close()

asyncio.run(get_claude_session())
