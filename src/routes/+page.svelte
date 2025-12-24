<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { I18n } from "$lib/index.js";
    import { changeLanguage } from "$lib/i18n/i18n.remote.js";
    import locale from "./locale.ts";

    let { data } = $props();

    const { t } = $derived(new I18n(locale, data.language));

    let count = $state(0);
    let userName = $state("Developer");
</script>

<svelte:head>
    <title>{data.title}</title>
</svelte:head>

<div class="container">
    <header>
        <h1>{t("demo.title")}</h1>
        <p class="subtitle">{t("demo.subtitle")}</p>
    </header>

    <main>
        <div>
            <h2>{t("demo.welcome")}</h2>
            <p>{t("demo.description")}</p>
        </div>

        <div>
            <h3>{t("demo.greeting", { name: userName })}</h3>
            <input
                type="text"
                bind:value={userName}
                placeholder="Enter your name"
            />
        </div>

        <div>
            <p class="counter">{t("demo.counter", { count })}</p>
            <button onclick={() => count++}>{t("actions.increment")}</button>
        </div>

        <div>
            <h3>{t("demo.features.title")}</h3>
            <ul>
                <li>{t("demo.features.cookies")}</li>
                <li>{t("demo.features.reactive")}</li>
                <li>{t("demo.features.typed")}</li>
                <li>{t("demo.features.simple")}</li>
            </ul>
        </div>

        <div>
            <p>{t("actions.switchLanguage")}:</p>
            <div class="buttons">
                <button
                    onclick={async () => {
                        await changeLanguage("en");
                        await invalidateAll();
                    }}
                    class:active={data.language === "en"}
                >
                    English
                </button>
                <button
                    onclick={async () => {
                        await changeLanguage("de");
                        await invalidateAll();
                    }}
                    class:active={data.language === "de"}
                >
                    Deutsch
                </button>
            </div>
        </div>
    </main>
</div>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    input {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 1rem;
        margin-top: 0.5rem;
        box-sizing: border-box;
    }

    input:focus {
        outline: none;
        border-color: #667eea;
    }

    .counter {
        font-size: 1.3rem;
        font-weight: 600;
        color: #333;
    }

    button {
        padding: 0.75rem 1.5rem;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    button:hover {
        background: #5568d3;
        transform: translateY(-1px);
    }

    button:active {
        transform: translateY(0);
    }

    .buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }

    .buttons button {
        flex: 1;
    }

    .buttons button.active {
        background: #764ba2;
    }
</style>
