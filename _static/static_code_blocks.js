document.addEventListener("DOMContentLoaded", function() {
    // Select all code blocks
    const codeBlocks = document.querySelectorAll('.highlight .c1');

    codeBlocks.forEach(function(block) {
        // Check if the comment starts with "# TODO"
        if (block.textContent.trim().startsWith('# TODO')) {
            block.style.color = '#ff0000';
            block.style.fontWeight = 'bold';
        }
        // Check if the comment starts with "# FIKSMEG"
        if (block.textContent.trim().startsWith('# FIKSMEG')) {
            block.style.color = '#ff0000';
            block.style.fontWeight = 'bold';
        }
        // Check if the comment starts with "# NOTE"
        if (block.textContent.trim().startsWith('# NOTE')) {
            block.style.color = '#ff0000';
            block.style.fontWeight = 'bold';
        }

        if (block.textContent.trim().startsWith('# FYLL INN')) {
            block.style.color = '#ff0000';
            block.style.fontWeight = 'bold';
        }

        if (block.textContent.trim().startsWith('# <--')) {
            block.style.color = '#ff0000';
            block.style.fontWeight = 'bold';
        }

        if (block.textContent.trim().startsWith('# MERK')) {
            block.style.color = '#ff0000';
            block.style.fontWeight = 'bold';
        }

        if (block.textContent.trim().startsWith('# IKKE RØR')) {
            block.style.color = '#ff0000';
            block.style.fontWeight = 'bold';
        }
    });
});


